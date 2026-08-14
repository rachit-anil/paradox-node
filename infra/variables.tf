variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Short name used in resource names and tags"
  type        = string
  default     = "paradox"
}

variable "environment" {
  description = "Environment label (e.g. production)"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Public hostname served by the ALB (ACM certificate)"
  type        = string
  default     = "projectparadox.in"
}

variable "route53_zone_id" {
  description = "Optional Route53 hosted zone ID for ACM DNS validation and alias record. Leave empty to validate ACM manually."
  type        = string
  default     = ""
}

variable "github_org" {
  description = "GitHub org or user that owns the repo (for OIDC trust)"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name (without org)"
  type        = string
  default     = "paradox-node"
}

variable "instance_type" {
  description = "EC2 instance type for app ASGs"
  type        = string
  default     = "t3.small"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t4g.micro"
}

variable "db_name" {
  description = "MySQL database name"
  type        = string
  default     = "spring"
}

variable "db_username" {
  description = "MySQL master username"
  type        = string
  default     = "paradox_app"
}

variable "app_port" {
  description = "Container/host port for the Node app"
  type        = number
  default     = 8080
}

variable "desired_capacity_active" {
  description = "Desired capacity for the active (live) ASG at bootstrap. Prefer 0 until the first image is pushed; deploy workflow scales up."
  type        = number
  default     = 0
}

variable "desired_capacity_idle" {
  description = "Desired capacity for the idle ASG at bootstrap (0 = scale on deploy)"
  type        = number
  default     = 0
}

variable "jwt_secret_key" {
  description = "JWT signing secret (stored in Secrets Manager). Set via TF_VAR or tfvars; do not commit."
  type        = string
  sensitive   = true
}

variable "google_oauth_client_id" {
  description = "Google OAuth client ID"
  type        = string
  sensitive   = true
  default     = ""
}

variable "google_oauth_client_secret" {
  description = "Google OAuth client secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "initial_image_tag" {
  description = "ECR image tag used by launch templates until the first Actions deploy"
  type        = string
  default     = "bootstrap"
}
