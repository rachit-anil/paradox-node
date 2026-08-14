terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Uncomment and configure after creating the state bucket + lock table:
  # backend "s3" {
  #   bucket         = "paradox-terraform-state"
  #   key            = "paradox-node/terraform.tfstate"
  #   region         = "ap-south-1"
  #   dynamodb_table = "paradox-terraform-locks"
  #   encrypt        = true
  # }
}
