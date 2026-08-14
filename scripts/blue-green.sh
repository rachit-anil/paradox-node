#!/usr/bin/env bash
# Blue-green helpers for GitHub Actions / operators.
# Requires: aws CLI v2, jq
set -euo pipefail

PROJECT_PREFIX="${PROJECT_PREFIX:-/paradox}"
AWS_REGION="${AWS_REGION:?AWS_REGION is required}"
NAME_PREFIX="${NAME_PREFIX:-paradox-production}"

ACTIVE_PARAM="${PROJECT_PREFIX}/active_slot"
PREVIOUS_PARAM="${PROJECT_PREFIX}/previous_slot"
IMAGE_TAG_PARAM="${PROJECT_PREFIX}/image_tag"
PREVIOUS_IMAGE_TAG_PARAM="${PROJECT_PREFIX}/previous_image_tag"

asg_name() {
  local slot="$1"
  echo "${NAME_PREFIX}-${slot}"
}

tg_arn() {
  local slot="$1"
  aws elbv2 describe-target-groups \
    --names "${NAME_PREFIX}-${slot}" \
    --region "$AWS_REGION" \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text
}

https_listener_arn() {
  local alb_arn
  alb_arn=$(aws elbv2 describe-load-balancers \
    --names "${NAME_PREFIX}-alb" \
    --region "$AWS_REGION" \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text)
  aws elbv2 describe-listeners \
    --load-balancer-arn "$alb_arn" \
    --region "$AWS_REGION" \
    --query "Listeners[?Port==\`443\`].ListenerArn | [0]" \
    --output text
}

get_active_slot() {
  aws ssm get-parameter --name "$ACTIVE_PARAM" --region "$AWS_REGION" --query 'Parameter.Value' --output text
}

inactive_slot() {
  local active="$1"
  if [[ "$active" == "blue" ]]; then
    echo "green"
  else
    echo "blue"
  fi
}

wait_for_healthy() {
  local tg="$1"
  local timeout_seconds="${2:-600}"
  local start
  start=$(date +%s)

  echo "Waiting for healthy targets on $tg (timeout ${timeout_seconds}s)..."
  while true; do
    local health
    health=$(aws elbv2 describe-target-health \
      --target-group-arn "$tg" \
      --region "$AWS_REGION" \
      --output json)

    local healthy total
    healthy=$(echo "$health" | jq '[.TargetHealthDescriptions[] | select(.TargetHealth.State=="healthy")] | length')
    total=$(echo "$health" | jq '.TargetHealthDescriptions | length')

    echo "  healthy=$healthy total=$total"
    if [[ "$total" -gt 0 && "$healthy" -ge 1 ]]; then
      echo "Target group is healthy."
      return 0
    fi

    local now
    now=$(date +%s)
    if (( now - start > timeout_seconds )); then
      echo "Timed out waiting for healthy targets." >&2
      echo "$health" | jq .
      return 1
    fi
    sleep 15
  done
}

cmd_deploy() {
  local image_tag="${1:?image tag required}"
  local active inactive
  active=$(get_active_slot)
  inactive=$(inactive_slot "$active")

  echo "Active=$active Inactive=$inactive ImageTag=$image_tag"

  local previous_tag
  previous_tag=$(aws ssm get-parameter --name "$IMAGE_TAG_PARAM" --region "$AWS_REGION" --query 'Parameter.Value' --output text)
  aws ssm put-parameter \
    --name "$PREVIOUS_IMAGE_TAG_PARAM" \
    --type String \
    --value "$previous_tag" \
    --overwrite \
    --region "$AWS_REGION" >/dev/null

  aws ssm put-parameter \
    --name "$IMAGE_TAG_PARAM" \
    --type String \
    --value "$image_tag" \
    --overwrite \
    --region "$AWS_REGION" >/dev/null

  local inactive_asg
  inactive_asg=$(asg_name "$inactive")

  # Force new instances to re-run user-data path by cycling desired capacity.
  # Scale to 0 first if anything is lingering, then to 1.
  echo "Scaling $inactive_asg -> 0"
  aws autoscaling update-auto-scaling-group \
    --auto-scaling-group-name "$inactive_asg" \
    --desired-capacity 0 \
    --min-size 0 \
    --region "$AWS_REGION"

  # Wait briefly for terminate
  sleep 20

  echo "Scaling $inactive_asg -> 1 (EC2 spins up)"
  aws autoscaling update-auto-scaling-group \
    --auto-scaling-group-name "$inactive_asg" \
    --desired-capacity 1 \
    --min-size 0 \
    --max-size 2 \
    --region "$AWS_REGION"

  # Start instance refresh so new launch pulls latest IMAGE_TAG from SSM
  aws autoscaling start-instance-refresh \
    --auto-scaling-group-name "$inactive_asg" \
    --preferences MinHealthyPercentage=0,InstanceWarmup=60 \
    --region "$AWS_REGION" >/dev/null || true

  local inactive_tg
  inactive_tg=$(tg_arn "$inactive")
  wait_for_healthy "$inactive_tg" 900

  local listener
  listener=$(https_listener_arn)
  echo "Switching HTTPS listener to $inactive"
  aws elbv2 modify-listener \
    --listener-arn "$listener" \
    --default-actions "Type=forward,TargetGroupArn=$inactive_tg" \
    --region "$AWS_REGION" >/dev/null

  aws ssm put-parameter --name "$PREVIOUS_PARAM" --type String --value "$active" --overwrite --region "$AWS_REGION" >/dev/null
  aws ssm put-parameter --name "$ACTIVE_PARAM" --type String --value "$inactive" --overwrite --region "$AWS_REGION" >/dev/null

  local active_asg
  active_asg=$(asg_name "$active")
  echo "Draining previous slot ASG $active_asg -> 0"
  aws autoscaling update-auto-scaling-group \
    --auto-scaling-group-name "$active_asg" \
    --desired-capacity 0 \
    --min-size 0 \
    --region "$AWS_REGION"

  echo "Deploy complete. Live slot is now $inactive"
}

cmd_rollback() {
  local active previous
  active=$(get_active_slot)
  previous=$(aws ssm get-parameter --name "$PREVIOUS_PARAM" --region "$AWS_REGION" --query 'Parameter.Value' --output text)

  if [[ "$active" == "$previous" ]]; then
    echo "Active and previous slots are the same ($active); nothing to roll back to." >&2
    exit 1
  fi

  echo "Rolling back from $active to $previous"

  local prev_image_tag
  prev_image_tag=$(aws ssm get-parameter --name "$PREVIOUS_IMAGE_TAG_PARAM" --region "$AWS_REGION" --query 'Parameter.Value' --output text)
  local current_image_tag
  current_image_tag=$(aws ssm get-parameter --name "$IMAGE_TAG_PARAM" --region "$AWS_REGION" --query 'Parameter.Value' --output text)

  # Restore previous image so newly launched instances run the last-known-good build
  aws ssm put-parameter --name "$IMAGE_TAG_PARAM" --type String --value "$prev_image_tag" --overwrite --region "$AWS_REGION" >/dev/null
  aws ssm put-parameter --name "$PREVIOUS_IMAGE_TAG_PARAM" --type String --value "$current_image_tag" --overwrite --region "$AWS_REGION" >/dev/null

  local prev_asg
  prev_asg=$(asg_name "$previous")

  echo "Scaling $prev_asg -> 0 then 1 with image $prev_image_tag"
  aws autoscaling update-auto-scaling-group \
    --auto-scaling-group-name "$prev_asg" \
    --desired-capacity 0 \
    --min-size 0 \
    --region "$AWS_REGION"
  sleep 20

  aws autoscaling update-auto-scaling-group \
    --auto-scaling-group-name "$prev_asg" \
    --desired-capacity 1 \
    --min-size 0 \
    --max-size 2 \
    --region "$AWS_REGION"

  local prev_tg
  prev_tg=$(tg_arn "$previous")
  wait_for_healthy "$prev_tg" 600

  local listener
  listener=$(https_listener_arn)
  aws elbv2 modify-listener \
    --listener-arn "$listener" \
    --default-actions "Type=forward,TargetGroupArn=$prev_tg" \
    --region "$AWS_REGION" >/dev/null

  aws ssm put-parameter --name "$PREVIOUS_PARAM" --type String --value "$active" --overwrite --region "$AWS_REGION" >/dev/null
  aws ssm put-parameter --name "$ACTIVE_PARAM" --type String --value "$previous" --overwrite --region "$AWS_REGION" >/dev/null

  local active_asg
  active_asg=$(asg_name "$active")
  aws autoscaling update-auto-scaling-group \
    --auto-scaling-group-name "$active_asg" \
    --desired-capacity 0 \
    --min-size 0 \
    --region "$AWS_REGION"

  echo "Rollback complete. Live slot is now $previous"
}

usage() {
  cat <<EOF
Usage:
  $0 deploy <image-tag>
  $0 rollback

Env:
  AWS_REGION (required)
  PROJECT_PREFIX (default /paradox)
  NAME_PREFIX (default paradox-production)
EOF
}

main() {
  local cmd="${1:-}"
  case "$cmd" in
    deploy)
      shift
      cmd_deploy "$@"
      ;;
    rollback)
      cmd_rollback
      ;;
    *)
      usage
      exit 1
      ;;
  esac
}

main "$@"
