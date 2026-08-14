resource "aws_secretsmanager_secret" "app" {
  name                    = local.app_secret_name
  recovery_window_in_days = 0

  tags = {
    Name = "${local.name_prefix}-app-secret"
  }
}

resource "aws_secretsmanager_secret_version" "app" {
  secret_id = aws_secretsmanager_secret.app.id

  secret_string = jsonencode({
    DB_HOST                    = aws_db_instance.main.address
    DB_PORT                    = tostring(aws_db_instance.main.port)
    DB_NAME                    = var.db_name
    DB_USER                    = var.db_username
    DB_PASSWORD                = random_password.db.result
    JWT_SECRET_KEY             = var.jwt_secret_key
    GOOGLE_OAUTH_CLIENT_ID     = var.google_oauth_client_id
    GOOGLE_OAUTH_CLIENT_SECRET = var.google_oauth_client_secret
    NODE_ENV                   = "production"
    PORT                       = tostring(var.app_port)
  })
}

resource "aws_ssm_parameter" "active_slot" {
  name  = local.active_slot
  type  = "String"
  value = "blue"

  lifecycle {
    ignore_changes = [value]
  }

  tags = {
    Name = "${local.name_prefix}-active-slot"
  }
}

resource "aws_ssm_parameter" "previous_slot" {
  name  = local.previous_slot
  type  = "String"
  value = "blue"

  lifecycle {
    ignore_changes = [value]
  }

  tags = {
    Name = "${local.name_prefix}-previous-slot"
  }
}

resource "aws_ssm_parameter" "image_tag" {
  name  = local.image_tag_param
  type  = "String"
  value = var.initial_image_tag

  lifecycle {
    ignore_changes = [value]
  }

  tags = {
    Name = "${local.name_prefix}-image-tag"
  }
}

resource "aws_ssm_parameter" "previous_image_tag" {
  name  = "${local.ssm_prefix}/previous_image_tag"
  type  = "String"
  value = var.initial_image_tag

  lifecycle {
    ignore_changes = [value]
  }

  tags = {
    Name = "${local.name_prefix}-previous-image-tag"
  }
}

resource "aws_ssm_parameter" "ecr_repository_url" {
  name  = "${local.ssm_prefix}/ecr_repository_url"
  type  = "String"
  value = aws_ecr_repository.app.repository_url

  tags = {
    Name = "${local.name_prefix}-ecr-url"
  }
}

resource "aws_ssm_parameter" "app_secret_arn" {
  name  = "${local.ssm_prefix}/app_secret_arn"
  type  = "String"
  value = aws_secretsmanager_secret.app.arn

  tags = {
    Name = "${local.name_prefix}-secret-arn"
  }
}
