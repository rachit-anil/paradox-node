# paradox-node

Node.js + Angular app ("Project Paradox") with a **blue-green** AWS deploy path.

## Stack

| Layer | Local | Production |
|-------|--------|------------|
| API | Express (`src/`) | Docker image on EC2 ASG |
| UI | Angular (`ui/`) | Built into the same image, served by Express |
| DB | MySQL via `docker-compose` | Amazon RDS MySQL |
| Edge | — | ALB + ACM HTTPS |
| Deploy | — | GitHub Actions → ECR → blue/green ASG swap |

## Local development

```bash
# API deps
npm ci

# UI deps
cd ui && npm ci && cd ..

# MySQL + optional containerized app
docker compose up -d mysql

# Run API against local MySQL (see env below)
cp .env.example .env   # if present, or export vars
npm start

# UI
cd ui && npm start
```

Suggested local env:

```
NODE_ENV=development
PORT=8080
DB_HOST=localhost
DB_PORT=3306
DB_USER=rachitanil
DB_PASSWORD=root
DB_NAME=spring
JWT_SECRET_KEY=local-dev-secret
```

Health check: `GET http://localhost:8080/health`

## Production deploy (blue-green)

Infrastructure and runbooks live in [`infra/README.md`](infra/README.md).

Summary:

1. `terraform apply` in `infra/` (VPC, ALB, 2 ASGs, RDS, ECR, OIDC role).
2. Configure GitHub Environment `production` with secret `AWS_ROLE_ARN`.
3. Point DNS at the ALB; complete ACM validation if needed.
4. Push to `main` → CI quality gate → image push → inactive ASG scales up → `/health` → ALB cutover.
5. Rollback via Actions workflow **Rollback (blue-green)**.

Scripts:

- [`scripts/blue-green.sh`](scripts/blue-green.sh) — deploy / rollback helpers used by Actions

## Important production notes

- DB credentials come from Secrets Manager (written by Terraform); do not commit secrets.
- Schema sync is **off** in production unless `DB_SYNCHRONIZE=true` (one-time bootstrap only — see infra README).
- `setup.sh` (legacy Nginx/Certbot on a single EC2) is deprecated; TLS is on the ALB.
