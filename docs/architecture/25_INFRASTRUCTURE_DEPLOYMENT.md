# 25 — Infrastructure & Deployment Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Production Infrastructure Topology, AWS Environment Layout, Container Orchestration & Terraform IaC  

---

## 1. AWS Production Infrastructure Topology

Alpha is deployed on AWS infrastructure using containerized micro-services managed via AWS ECS Fargate or EKS, fronted by Cloudflare CDN / WAF.

```text
                                Cloudflare CDN / WAF / DNS
                                            │
                                            ▼
                               AWS Application Load Balancer (ALB)
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               │                                                         │
    [ECS Web Container Tasks]                                 [ECS API Container Tasks]
       (Next.js App Engine)                                     (NestJS API Monolith)
               │                                                         │
               └────────────────────────────┬────────────────────────────┘
                                            │
                     ┌──────────────────────┼──────────────────────┐
                     ▼                      ▼                      ▼
           [AWS RDS PostgreSQL 16]   [ElastiCache Redis]   [AWS S3 Buckets]
            (Multi-AZ + Replica)       (Cluster Mode)       (Media Assets)
```

---

## 2. Infrastructure Component Matrix

| Subsystem | Managed AWS / Cloudflare Service | Sizing / Configuration |
|---|---|---|
| **Edge / CDN** | Cloudflare Enterprise / Pro | WAF, DDoS Protection, Custom Hostnames, Page Rules |
| **Web Frontend** | AWS ECS Fargate (`apps/web`) | 2+ Tasks (Auto-scaling 2 to 10 tasks based on CPU/RAM) |
| **API Backend** | AWS ECS Fargate (`apps/api`) | 2+ Tasks (Auto-scaling 2 to 20 tasks based on Request Count) |
| **Background Workers** | AWS ECS Fargate (`worker-app`) | 2 Tasks dedicated to BullMQ queue processing |
| **Database** | AWS RDS PostgreSQL 16 | db.m6g.xlarge (Multi-AZ Primary + 1 Read Replica) |
| **Cache / Queues** | AWS ElastiCache Redis | cache.m6g.large (Cluster Mode Enabled) |
| **Object Storage** | AWS S3 Bucket (`alpha-prod-media`) | Multi-region replication + Cloudflare R2 backup |

---

## 3. Terraform Infrastructure-as-Code Blueprint

All AWS resources are defined declaratively in `/infrastructure/terraform`:

```hcl
# main.tf - AWS RDS PostgreSQL Instance Module
module "postgres_rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"

  identifier = "alpha-prod-db"
  engine     = "postgres"
  engine_version = "16.1"
  instance_class = "db.m6g.xlarge"

  allocated_storage     = 100
  max_allocated_storage = 1000
  storage_type          = "gp3"

  multi_az               = true
  db_name                = "alphadb"
  username               = "alphaadmin"
  db_subnet_group_name   = module.vpc.database_subnet_group_name
  vpc_security_group_ids = [aws_security_group.db_sg.id]

  deletion_protection = true
  backup_retention_period = 30
}
```
