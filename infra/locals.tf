locals {
  name_prefix = "${var.project_name}-${var.environment}"

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
  }

  create_route53_records = var.route53_zone_id != ""

  # SSM / Secrets Manager paths
  ssm_prefix     = "/${var.project_name}"
  active_slot    = "${local.ssm_prefix}/active_slot"
  previous_slot  = "${local.ssm_prefix}/previous_slot"
  image_tag_param = "${local.ssm_prefix}/image_tag"

  app_secret_name = "${local.name_prefix}/app"
}
