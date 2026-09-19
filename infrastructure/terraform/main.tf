terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  default = "ap-south-1" # AWS Mumbai Region for India-First deployment
}

# 1. AWS VPC Configuration
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "alpha-prod-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["ap-south-1a", "ap-south-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
}

# 2. Managed RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier           = "alpha-prod-db"
  allocated_storage    = 100
  storage_type         = "gp3"
  engine               = "postgres"
  engine_version       = "16.1"
  instance_class       = "db.m6g.xlarge"
  db_name              = "alphadb"
  username             = "alphaadmin"
  password             = var.db_password
  multi_az             = true
  skip_final_snapshot  = false
}

# 3. Managed ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "alpha-prod-redis"
  engine               = "redis"
  node_type            = "cache.m6g.large"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}

# 4. S3 Object Storage Bucket
resource "aws_s3_bucket" "media_storage" {
  bucket = "alpha-prod-media-storage"
}

variable "db_password" {
  type      = string
  sensitive = true
}
