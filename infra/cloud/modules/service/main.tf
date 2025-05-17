variable "name" {
  type = string
}

variable "assignment" {
  type = object({
    vpc_id = string
    cluster_id = string
    sg_id = string
    subnet_id = string
  })
}

variable "exposure" {
  type = object({
    listener_arn = string
    exposed_path = string
    health_check_path = string
  })
  default = null
}

variable "env" {
  type = map(string)
}

variable "ports" {
  type = list(number)
}

variable "cpu" {
  type = number
  default = 256
}

variable "memory" {
  type = number
  default = 512
}

variable "replication" {
  type = number
  default = 1
}

resource "aws_ecr_repository" "service" {
  name                 = "${var.name}-ecr"
  image_tag_mutability = "MUTABLE"
  
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_lifecycle_policy" "service" {
  repository = aws_ecr_repository.service.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        selection = {
          tagStatus = "untagged"
          countType = "sinceImagePushed"
          countUnit = "days"
          countNumber = 30
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

resource "aws_ecs_task_definition" "service" {
  family                   = "${var.name}-ecstask"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory

  container_definitions = jsonencode([
    {
      name      = var.name
      image     = aws_ecr_repository.service.repository_url
      essential = true
      portMappings = [
        for port in var.ports : {
          containerPort = port
          hostPort      = port
        }
      ]
      environment = [
        for each in var.env : {
          name = each.key
          value = each.value
        }
      ]
      volumes = [
        {
          name = "postgres-data",
          host = {
            source_path = "/var/lib/postgresql/data"
          }
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "service" {
  name            = "${var.name}-ecs"
  cluster         = var.assignment.cluster_id
  task_definition = aws_ecs_task_definition.service.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [var.assignment.sg_id]
    subnets         = var.assignment.subnet_id
  }

  dynamic "load_balancer" {
    for_each = var.exposure != null ? [1] : []

    content {
      target_group_arn = aws_lb_target_group.service[0].arn
      container_name   = var.name
      container_port   = var.ports[0] 
    }
  }

  depends_on = [
    aws_lb_listener_rule.app
  ]
}

resource "aws_lb_target_group" "service" {
  count = var.exposure != null ? 1 : 0

  name     = "${var.name}-lbgroup"
  port     = var.ports[0]
  protocol = "HTTP"
  vpc_id   = var.assignment.vpc_id

  health_check {
    path                = var.exposure.health_check_path
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener_rule" "service" {
  count = var.exposure != null ? 1 : 0

  listener_arn = var.exposure.listener_arn
  priority     = 102

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.service.arn
  }

  condition {
    path_pattern {
      values = [var.exposure.exposed_path]
    }
  }
}
