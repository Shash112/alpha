# AWS Deployment Script for Alpha Monorepo
$AWS_ACCOUNT_ID="420943511468"
$AWS_REGION="ap-south-1"
$PROFILE="weblance-dev"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Deploying Alpha Monorepo to AWS ($AWS_ACCOUNT_ID)" -ForegroundColor Cyan
Write-Host " Region: $AWS_REGION" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. AWS ECR Login
Write-Host "`n1. Authenticating with AWS ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $AWS_REGION --profile $PROFILE | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# 2. Build & Push API Container
Write-Host "`n2. Building & Pushing Alpha API..." -ForegroundColor Yellow
docker build -f infrastructure/docker/Dockerfile.api -t "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/alpha-api:latest" .
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/alpha-api:latest"

# 3. Build & Push Web Container
Write-Host "`n3. Building & Pushing Alpha Web..." -ForegroundColor Yellow
docker build -f infrastructure/docker/Dockerfile.web -t "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/alpha-web:latest" .
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/alpha-web:latest"

# 4. Build & Push Admin Container
Write-Host "`n4. Building & Pushing Alpha Admin..." -ForegroundColor Yellow
docker build -f infrastructure/docker/Dockerfile.admin -t "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/alpha-admin:latest" .
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/alpha-admin:latest"

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host " All Production Containers Pushed to ECR!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
