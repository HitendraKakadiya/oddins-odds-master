# Oddins Sports - Production Infrastructure

AWS CDK infrastructure for Oddins Sports betting platform.

## Architecture

- **Region**: us-east-1
- **VPC**: 10.0.0.0/16 across 2 AZs
- **Compute**: ECS Fargate Spot (Graviton/ARM64)
- **Database**: RDS PostgreSQL (db.t4g.micro)
- **Load Balancer**: Application Load Balancer with ACM certificate
- **Monitoring**: CloudWatch Logs, Alarms, and Dashboards

## Prerequisites

1. **AWS CLI** configured with `sports-cli` profile
2. **Node.js** 20+ and pnpm
3. **Docker** for building images

## Initial Setup

### 1. Install Dependencies

```bash
cd infrastructure
pnpm install
```

### 2. Bootstrap CDK (One-time)

```bash
pnpm cdk bootstrap aws://545586473769/us-east-1 --profile sports-cli
```

### 3. Build TypeScript

```bash
pnpm build
```

## Deployment

### Deploy All Stacks

```bash
# Review changes
pnpm diff

# Deploy everything
pnpm deploy
```

### Deploy Individual Stacks

```bash
# Network first
pnpm deploy:network

# Secrets
pnpm deploy:secrets

# Database (depends on Network + Secrets)
pnpm deploy:database

# CICD (ECR repositories)
pnpm deploy:cicd

# Compute (ECS cluster, services)
pnpm deploy:compute

# Load Balancer
pnpm deploy:loadbalancer

# Monitoring
pnpm deploy:monitoring
```

## Post-Deployment Steps

### 1. Update API Football Secret

After secrets are deployed, update the API key:

```bash
aws secretsmanager update-secret \
  --secret-id sports/production/api-football-key \
  --secret-string '{"apiKey":"b109ed704df373015c3a1e009e3df057"}' \
  --profile sports-cli \
  --region us-east-1
```

### 2. Get Database Connection String

```bash
# Get database password
aws secretsmanager get-secret-value \
  --secret-id sports/production/database \
  --profile sports-cli \
  --region us-east-1 \
  --query SecretString \
  --output text | jq -r '.password'

# Connection string will be in stack outputs
```

### 3. Confirm SNS Email Subscription

Check your email (`urieah.avni@gmail.com`) and confirm the CloudWatch alarms subscription.

### 4. Build and Push Docker Images

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 --profile sports-cli | \
  docker login --username AWS --password-stdin 545586473769.dkr.ecr.us-east-1.amazonaws.com

# Build and push (from project root)
cd ..

# API
docker build -f apps/api/Dockerfile -t 545586473769.dkr.ecr.us-east-1.amazonaws.com/oddins/api:latest .
docker push 545586473769.dkr.ecr.us-east-1.amazonaws.com/oddins/api:latest

# Frontend
docker build -f apps/frontend/Dockerfile -t 545586473769.dkr.ecr.us-east-1.amazonaws.com/oddins/frontend:latest .
docker push 545586473769.dkr.ecr.us-east-1.amazonaws.com/oddins/frontend:latest

# Worker
docker build -f apps/worker/Dockerfile -t 545586473769.dkr.ecr.us-east-1.amazonaws.com/oddins/worker:latest .
docker push 545586473769.dkr.ecr.us-east-1.amazonaws.com/oddins/worker:latest
```

### 5. Run Database Migrations

```bash
# SSH into a running ECS task or run a one-off task
# (We'll create a proper migration runner next)
```

### 6. Force ECS Service Update

After images are pushed:

```bash
aws ecs update-service \
  --cluster oddins-production \
  --service oddins-production-api \
  --force-new-deployment \
  --profile sports-cli \
  --region us-east-1

aws ecs update-service \
  --cluster oddins-production \
  --service oddins-production-frontend \
  --force-new-deployment \
  --profile sports-cli \
  --region us-east-1
```

## Accessing Resources

### View CloudWatch Dashboard

```bash
# Get dashboard URL from stack outputs
aws cloudformation describe-stacks \
  --stack-name MonitoringStack \
  --profile sports-cli \
  --region us-east-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`DashboardUrl`].OutputValue' \
  --output text
```

### View Logs

```bash
# API logs
aws logs tail /ecs/oddins-production-api --follow --profile sports-cli --region us-east-1

# Frontend logs
aws logs tail /ecs/oddins-production-frontend --follow --profile sports-cli --region us-east-1

# Worker logs
aws logs tail /ecs/oddins-production-worker --follow --profile sports-cli --region us-east-1
```

### Connect to Database

```bash
# Get endpoint from outputs
DB_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name DatabaseStack \
  --profile sports-cli \
  --region us-east-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`DatabaseEndpoint`].OutputValue' \
  --output text)

# Get password from secrets
DB_PASSWORD=$(aws secretsmanager get-secret-value \
  --secret-id sports/production/database \
  --profile sports-cli \
  --region us-east-1 \
  --query SecretString \
  --output text | jq -r '.password')

# Connect (from within VPC or via bastion)
psql "postgresql://oddins:$DB_PASSWORD@$DB_ENDPOINT:5432/oddins_odds"
```

## Maintenance

### Update Service

```bash
# After pushing new images
aws ecs update-service \
  --cluster oddins-production \
  --service oddins-production-api \
  --force-new-deployment \
  --profile sports-cli
```

### Scale Service

```bash
aws ecs update-service \
  --cluster oddins-production \
  --service oddins-production-api \
  --desired-count 4 \
  --profile sports-cli
```

### View Service Status

```bash
aws ecs describe-services \
  --cluster oddins-production \
  --services oddins-production-api oddins-production-frontend \
  --profile sports-cli
```

## Cost Optimization

Current monthly cost: ~$100/mo

- NAT Gateway: $32/mo
- ECS Fargate Spot: $20/mo
- RDS db.t4g.micro: $15/mo
- ALB: $16/mo
- Data Transfer: $5/mo
- Other (S3, ECR, Secrets, Logs): $12/mo

## Cleanup

⚠️ **WARNING**: This will delete all resources!

```bash
pnpm destroy
```

## Troubleshooting

### Stack fails due to certificate validation

The ACM certificate requires DNS validation. Ensure Route53 hosted zone exists and is properly configured.

### ECS tasks fail to start

Check:
1. Docker images are pushed to ECR
2. Secrets exist and are accessible
3. Task execution role has correct permissions
4. Check CloudWatch logs for errors

### Database connection failures

Check:
1. Security groups allow ECS tasks to connect to RDS
2. Database is in AVAILABLE state
3. Connection string is correct
4. Password from Secrets Manager is correct

## Support

See main project documentation in `/home/elad/odds/project_docs/`

