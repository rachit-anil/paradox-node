data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

locals {
  user_data = templatefile("${path.module}/user_data.sh.tpl", {
    aws_region         = var.aws_region
    ecr_repository_url = aws_ecr_repository.app.repository_url
    app_secret_arn     = aws_secretsmanager_secret.app.arn
    image_tag_param    = local.image_tag_param
    app_port           = var.app_port
    project_name       = var.project_name
  })
}

resource "aws_launch_template" "app" {
  name_prefix   = "${local.name_prefix}-"
  image_id      = data.aws_ami.al2023.id
  instance_type = var.instance_type

  iam_instance_profile {
    name = aws_iam_instance_profile.ec2.name
  }

  vpc_security_group_ids = [aws_security_group.app.id]

  user_data = base64encode(local.user_data)

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 2
  }

  monitoring {
    enabled = true
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${local.name_prefix}-app"
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "blue" {
  name                      = "${local.name_prefix}-blue"
  min_size                  = 0
  max_size                  = 2
  desired_capacity          = var.desired_capacity_active
  vpc_zone_identifier       = aws_subnet.private[*].id
  health_check_type         = "ELB"
  health_check_grace_period = 180
  target_group_arns         = [aws_lb_target_group.blue.arn]

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${local.name_prefix}-blue"
    propagate_at_launch = true
  }

  tag {
    key                 = "Slot"
    value               = "blue"
    propagate_at_launch = true
  }

  lifecycle {
    ignore_changes = [desired_capacity]
  }
}

resource "aws_autoscaling_group" "green" {
  name                      = "${local.name_prefix}-green"
  min_size                  = 0
  max_size                  = 2
  desired_capacity          = var.desired_capacity_idle
  vpc_zone_identifier       = aws_subnet.private[*].id
  health_check_type         = "ELB"
  health_check_grace_period = 180
  target_group_arns         = [aws_lb_target_group.green.arn]

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${local.name_prefix}-green"
    propagate_at_launch = true
  }

  tag {
    key                 = "Slot"
    value               = "green"
    propagate_at_launch = true
  }

  lifecycle {
    ignore_changes = [desired_capacity]
  }
}
