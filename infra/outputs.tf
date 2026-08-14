output "alb_dns_name" {
  description = "ALB DNS name — point your domain CNAME/ALIAS here if not using Route53"
  value       = aws_lb.app.dns_name
}

output "alb_zone_id" {
  description = "ALB hosted zone ID for Route53 alias records"
  value       = aws_lb.app.zone_id
}

output "acm_certificate_arn" {
  description = "ACM certificate ARN"
  value       = aws_acm_certificate.app.arn
}

output "acm_validation_records" {
  description = "DNS records required to validate the ACM certificate (when Route53 zone is not managed)"
  value = [
    for dvo in aws_acm_certificate.app.domain_validation_options : {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  ]
}

output "ecr_repository_url" {
  description = "ECR repository URL for docker push/pull"
  value       = aws_ecr_repository.app.repository_url
}

output "github_actions_role_arn" {
  description = "IAM role ARN for GitHub Actions OIDC (set as AWS_ROLE_ARN secret)"
  value       = aws_iam_role.github_actions.arn
}

output "rds_endpoint" {
  description = "RDS MySQL endpoint hostname"
  value       = aws_db_instance.main.address
}

output "asg_blue_name" {
  value = aws_autoscaling_group.blue.name
}

output "asg_green_name" {
  value = aws_autoscaling_group.green.name
}

output "tg_blue_arn" {
  value = aws_lb_target_group.blue.arn
}

output "tg_green_arn" {
  value = aws_lb_target_group.green.arn
}

output "https_listener_arn" {
  value = aws_lb_listener.https.arn
}

output "ssm_active_slot" {
  value = aws_ssm_parameter.active_slot.name
}

output "ssm_previous_slot" {
  value = aws_ssm_parameter.previous_slot.name
}

output "ssm_image_tag" {
  value = aws_ssm_parameter.image_tag.name
}

output "ssm_previous_image_tag" {
  value = aws_ssm_parameter.previous_image_tag.name
}

output "launch_template_id" {
  value = aws_launch_template.app.id
}

output "app_secret_arn" {
  value = aws_secretsmanager_secret.app.arn
}

output "aws_region" {
  value = var.aws_region
}

output "project_name" {
  value = var.project_name
}
