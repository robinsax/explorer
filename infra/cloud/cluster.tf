resource "aws_ecs_cluster" "explorer" {
  name = "explorer-cluster"
}

resource "aws_subnet" "internal" {
  vpc_id            = aws_vpc.explorer.id
  cidr_block        = cidrsubnet(aws_vpc.explorer.cidr_block, 8, 1)
  availability_zone = data.aws_availability_zones.available.names[1]
  
  tags = {
    Name = "explorer-internal"
  }
}

resource "aws_security_group" "internal" {
  name        = "explorer-internal-sg"
  vpc_id      = aws_vpc.explorer.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [aws_security_group.public.id]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [aws_security_group.public.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

locals {
  assignment = {
    vpc_id = aws_vpc.explorer.id
    cluster_id = aws_ecs_cluster.explorer.id
    sg_id = aws_security_group.internal.id
    subnet_id = aws_subnet.internal.id
  }
}

module "app" {
  source = "./modules/service"
  assignment = local.assignment

  name = "explorer-app"

  ports = [80]
  env = {}

  exposure = {
    listener_arn = aws_lb_listener.http.arn
    exposed_path = "/"
    health_check_path = "/health"
  }
}

module "api" {
  source = "./modules/service"
  assignment = local.assignment

  name = "explorer-api"

  ports = [80]
  env = {}

  exposure = {
    listener_arn = aws_lb_listener.http.arn
    exposed_path = "/api"
    health_check_path = "/health"
  }
}

module "tiles" {
  source = "./modules/service"
  assignment = local.assignment

  name = "explorer-tiles"

  ports = [80]
  env = {}

  exposure = {
    listener_arn = aws_lb_listener.http.arn
    exposed_path = "/tiles"
    health_check_path = "/health"
  }
}
