# AWS ECR Infrastructure

This Terraform configuration sets up AWS ECR repositories for the Explorer application services.

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform >= 1.0.0
- AWS account with permissions to create ECR repositories and IAM roles

## Setup

1. Configure your AWS credentials:
```bash
aws configure
```

2. Initialize Terraform:
```bash
terraform init
```

3. Create a `terraform.tfvars` file with your variables:
```hcl
region = "us-west-2"
developer_arn = "arn:aws:iam::123456789012:user/your-user"
```

4. Plan and apply the infrastructure:
```bash
terraform plan
terraform apply
```

## Resources Created

- Three ECR repositories:
  - explorer-api
  - explorer-app
  - explorer-tileserver
- IAM role with ECR push permissions
- Lifecycle policies to expire old images

## Usage

After applying the configuration, you will get output with the repository URLs. Use these URLs to push your Docker images:

```bash
docker tag your-image:tag <repository-url>:tag
docker push <repository-url>:tag
```

## Security

- All repositories have image scanning enabled on push
- IAM roles are created with least privilege access
- Lifecycle policies ensure old images are cleaned up
