#!/bin/bash
set -euo pipefail

# Install Docker on Amazon Linux 2023
dnf update -y
dnf install -y docker jq aws-cli
systemctl enable --now docker
usermod -aG docker ec2-user

REGION="${aws_region}"
ECR_URL="${ecr_repository_url}"
SECRET_ARN="${app_secret_arn}"
IMAGE_TAG_PARAM="${image_tag_param}"
APP_PORT="${app_port}"
PROJECT="${project_name}"

IMAGE_TAG=$(aws ssm get-parameter --name "$IMAGE_TAG_PARAM" --region "$REGION" --query 'Parameter.Value' --output text)
SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id "$SECRET_ARN" --region "$REGION" --query 'SecretString' --output text)

# Write env file for the container
ENV_FILE=/etc/${PROJECT}.env
umask 077
echo "$SECRET_JSON" | jq -r 'to_entries[] | "\(.key)=\(.value)"' > "$ENV_FILE"

aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ECR_URL"

IMAGE="$ECR_URL:$IMAGE_TAG"
docker pull "$IMAGE" || {
  echo "Image $IMAGE not found yet; waiting for first CI push..."
  exit 1
}

docker rm -f paradox-app 2>/dev/null || true
docker run -d \
  --name paradox-app \
  --restart unless-stopped \
  --env-file "$ENV_FILE" \
  -p "$${APP_PORT}:$${APP_PORT}" \
  "$IMAGE"

# Simple health wait for local readiness (ALB still probes /health)
for i in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:$${APP_PORT}/health" >/dev/null; then
    echo "App healthy"
    exit 0
  fi
  sleep 2
done

echo "App failed health check"
exit 1
