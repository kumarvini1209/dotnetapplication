output "api_repository_url" {
  description = "Push the backend container image to this ECR repository"
  value       = aws_ecr_repository.api.repository_url
}

output "api_url" {
  description = "Public backend API URL"
  value       = "http://${aws_lb.api.dns_name}"
}

output "frontend_bucket_name" {
  description = "S3 bucket for the built frontend files"
  value       = aws_s3_bucket.frontend.bucket
}

output "frontend_url" {
  description = "CloudFront URL for the frontend"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "database_endpoint" {
  description = "Private RDS endpoint"
  value       = aws_db_instance.main.address
}

output "eks_cluster_name" {
  description = "EKS cluster name for kubectl configuration"
  value       = aws_eks_cluster.main.name
}

output "eks_kubeconfig_command" {
  description = "Command to configure kubectl for the EKS cluster"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${aws_eks_cluster.main.name}"
}
