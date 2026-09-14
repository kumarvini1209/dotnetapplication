# Catalog Service Starter

A small local full-stack application for testing a frontend-to-microservice workflow.

- `backend`: ASP.NET Core Web API on `http://localhost:5151`
- `frontend`: React + TypeScript + Vite on `http://localhost:5173`
- `GET /api/status`: backend health/status endpoint
- `GET /api/products`: sample catalog data stored in SQLite
- `backend/catalog.db`: local database file created on first backend start

## Run locally

Start the backend:

```powershell
dotnet run --project backend\Backend.csproj --urls http://localhost:5151
```

In a second terminal, start the frontend:

```powershell
npm run dev --prefix frontend
```

Open `http://localhost:5173` in a browser. The frontend proxies `/api` requests to the backend during local development.

The prototype uses SQLite so no separate database server is needed locally. The connection string is `Data Source=catalog.db` by default and can be overridden with the `ConnectionStrings__CatalogDatabase` environment variable.

Docker and Kubernetes configuration are intentionally not included yet.

## AWS Terraform

Terraform configuration is in `terraform/`. It provisions a VPC, private RDS PostgreSQL, ECR, ECS Fargate, EKS with a managed node group, an Application Load Balancer, and S3/CloudFront for the frontend.

From the repository root:

```powershell
terraform -chdir=terraform init
terraform -chdir=terraform plan -var='db_password=use-a-secret-value'
terraform -chdir=terraform apply -var='db_password=use-a-secret-value'
```

After applying Terraform, configure `kubectl` with the generated command:

```powershell
aws eks update-kubeconfig --region <aws-region> --name <eks-cluster-name>
kubectl get nodes
```

Build and push the backend image to the `api_repository_url` Terraform output before starting ECS tasks. Upload the built frontend `frontend/dist` contents to the `frontend_bucket_name` output. Terraform does not build or push application images and does not upload frontend assets.

The EKS cluster and worker nodes are provisioned for the next Kubernetes integration step. Kubernetes Deployment, Service, Ingress, and ConfigMap manifests are intentionally not included yet.
