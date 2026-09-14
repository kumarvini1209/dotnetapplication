variable "aws_region" {
  description = "AWS region for the application"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix for AWS resources"
  type        = string
  default     = "catalog-service"
}

variable "vpc_cidr" {
  description = "CIDR range for the application VPC"
  type        = string
  default     = "10.20.0.0/16"
}

variable "availability_zones" {
  description = "Two availability zones for high availability"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "catalog"
}

variable "db_username" {
  description = "PostgreSQL master username"
  type        = string
  default     = "catalog_admin"
}

variable "db_password" {
  description = "PostgreSQL master password"
  type        = string
  sensitive   = true
}

variable "api_image_tag" {
  description = "Container tag to deploy to ECS"
  type        = string
  default     = "latest"
}

variable "api_cpu" {
  description = "ECS task CPU units"
  type        = number
  default     = 512
}

variable "api_memory" {
  description = "ECS task memory in MiB"
  type        = number
  default     = 1024
}

variable "api_desired_count" {
  description = "Number of API tasks"
  type        = number
  default     = 2
}

variable "eks_kubernetes_version" {
  description = "Kubernetes version for the EKS control plane"
  type        = string
  default     = "1.31"
}

variable "eks_node_instance_types" {
  description = "EC2 instance types for the EKS managed node group"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "eks_node_desired_count" {
  description = "Desired EKS worker node count"
  type        = number
  default     = 2
}

variable "eks_node_min_count" {
  description = "Minimum EKS worker node count"
  type        = number
  default     = 2
}

variable "eks_node_max_count" {
  description = "Maximum EKS worker node count"
  type        = number
  default     = 4
}
