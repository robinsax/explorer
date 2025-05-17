variable "region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-west-2"
}

variable "developer_arn" {
  description = "ARN of the IAM user or role that will push images"
  type        = string
  sensitive   = true
}
