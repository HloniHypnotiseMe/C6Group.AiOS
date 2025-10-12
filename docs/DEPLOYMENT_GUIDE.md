# C6Group.AI OS v1.0 Deployment Guide

## 🚀 SUPERAAI Control System - Production Deployment

This guide provides complete instructions for deploying the C6Group.AI OS v1.0 (SUPERAAI Control System) to AWS infrastructure.

## 📋 Prerequisites

### Required Tools
- **Node.js 18+** - [Download](https://nodejs.org/)
- **AWS CLI v2** - [Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- **Serverless Framework** - `npm install -g serverless`
- **AWS Amplify CLI** - `npm install -g @aws-amplify/cli`
- **Git** - [Download](https://git-scm.com/)

### AWS Account Setup
1. **AWS Account** with administrative privileges
2. **AWS CLI configured** with proper credentials
3. **Domain registered** in Route 53 (c6group.co.za)
4. **AWS Budget** configured for cost monitoring

### Required AWS Services
- ✅ AWS Lambda (Serverless functions)
- ✅ Amazon DynamoDB (Database)
- ✅ AWS API Gateway (REST API)
- ✅ AWS Amplify (Frontend hosting)
- ✅ AWS Cognito (Authentication)
- ✅ Amazon Route 53 (DNS)
- ✅ AWS Certificate Manager (SSL/TLS)
- ✅ Amazon CloudWatch (Monitoring)

## 🛠️ Deployment Methods

### Method 1: Automated Deployment (Recommended)

The quickest way to deploy the complete system:

```bash
# Clone the repository
git clone https://github.com/HloniHypnotiseMe/C6Group.AiOS.git
cd C6Group.AiOS

# Run automated deployment
./deployment-scripts/deploy-infrastructure.sh
```

This script will:
1. ✅ Validate prerequisites
2. 🔧 Deploy backend Lambda functions and DynamoDB tables
3. 🔐 Configure AWS Cognito authentication
4. 🔒 Request SSL certificates
5. 🌐 Deploy React frontend to Amplify
6. 🌍 Configure Route 53 DNS records

### Method 2: Manual Step-by-Step Deployment

For more control over the deployment process:

#### Step 1: Configure Environment Variables

Create environment files from examples:

```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend environment  
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your values
```

#### Step 2: Deploy Backend Infrastructure

```bash
cd backend

# Install dependencies
npm install

# Deploy to AWS Lambda
serverless deploy --stage production --region us-east-1

# Note the API Gateway URL from the output
```

#### Step 3: Setup AWS Cognito Authentication

```bash
# Create User Pool
aws cognito-idp create-user-pool \
  --pool-name c6group-ai-os-users \
  --cli-input-json file://aws-configs/cognito-user-pool.json \
  --region us-east-1

# Create User Pool Client
aws cognito-idp create-user-pool-client \
  --user-pool-id YOUR_USER_POOL_ID \
  --cli-input-json file://aws-configs/cognito-user-pool-client.json \
  --region us-east-1
```

#### Step 4: Deploy Frontend to Amplify

```bash
cd frontend

# Install dependencies
npm install

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Configure environment variables in Amplify Console
amplify env add production

# Deploy
amplify publish
```

#### Step 5: Configure Custom Domain and SSL

```bash
# Request SSL certificate
aws acm request-certificate \
  --cli-input-json file://infrastructure/certificate-config.json \
  --region us-east-1

# Configure Route 53 DNS (after certificate validation)
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_ZONE_ID \
  --change-batch file://infrastructure/route53-config.json
```

## 🔐 Environment Configuration

### Backend Environment Variables (.env)

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# DynamoDB Tables
DYNAMO_TABLE=c6group-superaai-table
DYNAMO_TABLE_AGENTS=c6group-superaai-agents
DYNAMO_TABLE_ACTIVITIES=c6group-superaai-activities
DYNAMO_TABLE_METRICS=c6group-superaai-metrics

# AWS Cognito
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# API Configuration
API_GATEWAY_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod

# AI Services
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0

# Security
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
CORS_ORIGIN=https://os.c6group.co.za
```

### Frontend Environment Variables (.env)

```bash
# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_DOMAIN=c6group-ai-os-auth.auth.us-east-1.amazoncognito.com

# API Configuration
VITE_API_GATEWAY_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod

# Application Configuration
VITE_APP_URL=https://os.c6group.co.za
VITE_APP_NAME=C6Group.AI OS
VITE_APP_VERSION=1.0.0
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    C6Group.AI OS v1.0                      │
│                SUPERAAI Control System                      │
└─────────────────────────────────────────────────────────────┘

Frontend (React + TailwindCSS)
├── AWS Amplify Hosting
├── CloudFront CDN
└── Route 53 DNS (os.c6group.co.za)

Backend (Node.js + Express)
├── AWS API Gateway
├── AWS Lambda Functions
├── DynamoDB Tables
│   ├── Agents Table
│   ├── Activities Table
│   ├── Metrics Table
│   └── Main Table
└── AWS Cognito Authentication

AI Agents
├── Architect.AI (System Design)
├── Executor.AI (Deployment)
└── Observer.AI (Analytics)

Monitoring & Security
├── CloudWatch Logs
├── AWS Certificate Manager
├── AWS IAM Roles
└── Security Groups
```

## 🔄 CI/CD Pipeline

The system includes automated CI/CD pipelines for continuous deployment:

### GitHub Actions (Recommended)

```yaml
# .github/workflows/deploy.yml
name: Deploy C6Group.AI OS

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Deploy Backend
        run: |
          cd backend
          npm ci
          serverless deploy --stage production
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npm ci
          amplify publish --yes
```

## 📊 Monitoring and Logging

### CloudWatch Integration

All services are configured with CloudWatch monitoring:

- **Lambda Functions**: Execution metrics, error rates, duration
- **API Gateway**: Request counts, latency, error rates
- **DynamoDB**: Read/write capacity, throttling
- **Amplify**: Build status, deployment metrics

### Log Aggregation

```bash
# View backend logs
serverless logs -f api --stage production

# View Amplify build logs
amplify console hosting

# View CloudWatch logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/c6group-ai-os"
```

## 🛡️ Security Configuration

### SSL/TLS Certificate

The system uses AWS Certificate Manager for SSL/TLS:

```bash
# Request certificate
aws acm request-certificate \
  --domain-name os.c6group.co.za \
  --subject-alternative-names www.os.c6group.co.za api.os.c6group.co.za \
  --validation-method DNS
```

### IAM Roles and Permissions

Minimal required permissions for deployment:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:*",
        "apigateway:*",
        "dynamodb:*",
        "cognito-idp:*",
        "amplify:*",
        "route53:*",
        "acm:*",
        "cloudformation:*",
        "iam:*",
        "logs:*"
      ],
      "Resource": "*"
    }
  ]
}
```

## 💰 Cost Estimation

### Monthly AWS Costs (Estimated)

| Service | Usage | Cost |
|---------|--------|------|
| AWS Lambda | 1M requests | $0.20 |
| DynamoDB | 25 GB storage | $6.25 |
| API Gateway | 1M requests | $3.50 |
| Amplify Hosting | 5 GB transfer | $0.15 |
| Route 53 | Hosted zone | $0.50 |
| Certificate Manager | SSL cert | $0.00 |
| CloudWatch | Basic monitoring | $2.00 |
| **Total** | | **~$12.60/month** |

### Cost Optimization Tips

1. **DynamoDB**: Use on-demand billing for variable workloads
2. **Lambda**: Optimize function memory and timeout settings
3. **CloudWatch**: Set appropriate log retention periods
4. **API Gateway**: Use caching for frequently accessed endpoints

## 🚨 Troubleshooting

### Common Deployment Issues

#### 1. Serverless Deployment Fails

```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify region configuration
aws configure get region

# Clear Serverless cache
serverless info --stage production
```

#### 2. Amplify Build Fails

```bash
# Check build logs
amplify console hosting

# Verify environment variables
amplify env get

# Rebuild locally
npm run build
```

#### 3. Cognito Authentication Issues

```bash
# Verify User Pool configuration
aws cognito-idp describe-user-pool --user-pool-id YOUR_POOL_ID

# Check User Pool Client settings
aws cognito-idp describe-user-pool-client --user-pool-id YOUR_POOL_ID --client-id YOUR_CLIENT_ID
```

#### 4. DNS Resolution Issues

```bash
# Check DNS propagation
nslookup os.c6group.co.za

# Verify Route 53 records
aws route53 list-resource-record-sets --hosted-zone-id YOUR_ZONE_ID
```

## 🔧 Maintenance

### Regular Maintenance Tasks

1. **Security Updates**: Keep dependencies updated
2. **Cost Monitoring**: Review AWS billing monthly
3. **Performance Optimization**: Monitor CloudWatch metrics
4. **Backup Verification**: Test DynamoDB backups
5. **Certificate Renewal**: Monitor SSL certificate expiration

### Update Deployment

```bash
# Update backend
cd backend
serverless deploy --stage production

# Update frontend
cd frontend
amplify publish
```

## 📞 Support

For deployment support and troubleshooting:

- **Documentation**: [docs.c6group.ai](https://docs.c6group.ai)
- **Issues**: GitHub Issues in this repository
- **Email**: support@c6group.ai
- **Status Page**: [status.c6group.co.za](https://status.c6group.co.za)

## 🎯 Next Steps

After successful deployment:

1. 👥 **Create admin user** in Cognito User Pool
2. 🔐 **Configure user groups** and permissions
3. 📊 **Set up monitoring alerts** in CloudWatch
4. 🔄 **Test CI/CD pipeline** with a sample deployment
5. 📖 **Share access** with team members
6. 🚀 **Launch SUPERAAI Control System!**

---

**Built with ❤️ by C6Group.AI for the SUPERAAI Control System**