# Infrastructure (Terraform)

Blue-green AWS stack for **paradox-node**: VPC, ALB, dual ASGs, ECR, RDS MySQL, ACM, GitHub OIDC.

## Architecture

- **ALB** terminates HTTPS (ACM) and forwards to either the **blue** or **green** target group.
- Each color has its own **Auto Scaling Group**. Deployments scale the *inactive* ASG to 1 (EC2 launches automatically), wait for `/health`, then flip the ALB listener.
- **Rollback** flips the listener back to the previous target group and scales that ASG up if needed.
- **RDS MySQL** lives in private subnets; app instances pull credentials from **Secrets Manager** at boot.
- Images are stored in **ECR** and tagged with the git SHA.

## Prerequisites

- Terraform >= 1.5
- AWS account credentials with rights to create VPC/IAM/ALB/RDS/ECR
- GitHub repo matching `github_org` / `github_repo` variables
- Domain `projectparadox.in` (or override `domain_name`) you can point at the ALB

## Bootstrap

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# Edit github_org, domain_name, optional route53_zone_id

export TF_VAR_jwt_secret_key='a-long-random-secret'
export TF_VAR_google_oauth_client_id='...'
export TF_VAR_google_oauth_client_secret='...'

terraform init
terraform plan
terraform apply
```

### Outputs you need

| Output | Use |
|--------|-----|
| `github_actions_role_arn` | GitHub Actions secret `AWS_ROLE_ARN` |
| `alb_dns_name` | DNS CNAME/ALIAS for your domain (if not using Route53) |
| `acm_validation_records` | Create these DNS records if `route53_zone_id` is empty |
| `ecr_repository_url` | Confirms image registry |
| `rds_endpoint` | For optional mysqldump restore |

### GitHub configuration

1. Create a GitHub Environment named **`production`**.
2. Add secret **`AWS_ROLE_ARN`** = `github_actions_role_arn` output.
3. Optional repository/environment variables:
   - `AWS_REGION` (default `ap-south-1`)
   - `NAME_PREFIX` (default `paradox-production`)
   - `PROJECT_PREFIX` (default `/paradox`)

### DNS / TLS

**With Route53** (`route53_zone_id` set): Terraform validates ACM and creates the alias A record.

**Without Route53:**

1. Apply Terraform.
2. Create the ACM validation CNAME records from `acm_validation_records`.
3. Wait until the certificate is `ISSUED`.
4. Point `projectparadox.in` to `alb_dns_name` (ALIAS/CNAME/A depending on your DNS).

### First schema on empty RDS

Production disables TypeORM `synchronize` unless `DB_SYNCHRONIZE=true`.

One-time bootstrap:

```bash
# Merge DB_SYNCHRONIZE into the app secret, deploy once, then remove it
aws secretsmanager get-secret-value --secret-id paradox-production/app --query SecretString --output text \
  | jq '. + {DB_SYNCHRONIZE:"true"}' \
  | aws secretsmanager put-secret-value --secret-id paradox-production/app --secret-string file:///dev/stdin

# Run Deploy workflow (or workflow_dispatch)
# Then remove the flag:
aws secretsmanager get-secret-value --secret-id paradox-production/app --query SecretString --output text \
  | jq 'del(.DB_SYNCHRONIZE)' \
  | aws secretsmanager put-secret-value --secret-id paradox-production/app --secret-string file:///dev/stdin
```

Prefer real TypeORM migrations long-term.

## Deploy flow

On every push to `main` (or manual `workflow_dispatch`):

1. Quality gate (typecheck + Angular prod build)
2. Build/push image to ECR as `:git-sha`
3. `scripts/blue-green.sh deploy <sha>`:
   - Reads active slot from SSM `/paradox/active_slot`
   - Writes new image tag to `/paradox/image_tag`
   - Scales **inactive** ASG → 0 then → 1 (new EC2 + user-data pulls image)
   - Waits for target group healthy on `/health`
   - Switches HTTPS listener to the new target group
   - Records previous/active slots in SSM
   - Scales old ASG → 0

## Rollback

Actions → **Rollback (blue-green)** → Run workflow.

This restores `/paradox/previous_image_tag` into `/paradox/image_tag`, scales the previous color ASG with that image, waits for health, then flips the ALB listener.

Or locally:

```bash
export AWS_REGION=ap-south-1
./scripts/blue-green.sh rollback
```

## Migrating data from the old Docker MySQL

```bash
# On the old host
docker exec sql-container1 mysqldump -u rachitanil -proot spring > spring.dump.sql

# From a machine that can reach RDS (bastion / VPN / temporary public jump)
mysql -h <rds_endpoint> -u paradox_app -p spring < spring.dump.sql
```

Then cut DNS to the ALB and retire the old EC2 + SCP workflow.

## Cost notes

Defaults: `t3.small` app, `db.t4g.micro` RDS, single NAT Gateway. Scale instance classes via tfvars. ASGs start at desired `0` until the first successful deploy.

## Remote state (recommended)

Create an S3 bucket + DynamoDB lock table, then uncomment the `backend "s3"` block in `versions.tf` and re-run `terraform init -migrate-state`.

## Import existing GitHub OIDC provider

If apply fails because the OIDC provider already exists:

```bash
terraform import aws_iam_openid_connect_provider.github \
  arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com
```
