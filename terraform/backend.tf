terraform {
  backend "s3" {
    bucket       = "catalog-service-terraform-state-487509570252"
    key          = "catalog-service/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
