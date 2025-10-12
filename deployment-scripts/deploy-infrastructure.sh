#!/bin/bash

# C6Group.AI OS v1.0 – SUPERAAI System Initialization
# Infrastructure Deployment Script
# 
# Description: Complete AWS infrastructure deployment automation
# Author: C6Group.AI Development Team
# Version: 1.0.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="C6Group.AI OS v1.0"
SERVICE_NAME="c6group-ai-os"
DOMAIN_NAME="os.c6group.co.za"
REGION="${AWS_REGION:-us-east-1}"
STAGE="${DEPLOYMENT_STAGE:-production}"

echo -e "${BLUE}🚀 ${PROJECT_NAME} - SUPERAAI System Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI is not installed${NC}"
        exit 1
    fi
    
    # Check Serverless Framework
    if ! command -v serverless &> /dev/null; then
        echo -e "${RED}❌ Serverless Framework is not installed${NC}"
        exit 1
    fi
    
    # Check Amplify CLI
    if ! command -v amplify &> /dev/null; then
        echo -e "${RED}❌ Amplify CLI is not installed${NC}"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}❌ AWS credentials not configured${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All prerequisites met${NC}"
}

# Deploy backend infrastructure
deploy_backend() {
    echo -e "${YELLOW}🔧 Deploying backend infrastructure...${NC}"
    
    cd backend
    
    # Install dependencies
    echo "Installing backend dependencies..."
    npm ci --production=false
    
    # Deploy with Serverless
    echo "Deploying Lambda functions and DynamoDB tables..."
    serverless deploy --stage $STAGE --region $REGION --verbose
    
    # Get API Gateway URL
    API_URL=$(serverless info --stage $STAGE --region $REGION | grep "POST - " | head -1 | awk '{print $3}' | sed 's/\/{proxy+}$//')
    echo "API Gateway URL: $API_URL"
    
    cd ..
    
    echo -e "${GREEN}✅ Backend deployment completed${NC}"
    return $API_URL
}

# Create Cognito User Pool
setup_cognito() {
    echo -e "${YELLOW}🔐 Setting up AWS Cognito authentication...${NC}"
    
    # Create User Pool
    echo "Creating Cognito User Pool..."
    USER_POOL_ID=$(aws cognito-idp create-user-pool \
        --pool-name "${SERVICE_NAME}-users" \
        --cli-input-json file://aws-configs/cognito-user-pool.json \
        --region $REGION \
        --output text --query 'UserPool.Id')
    
    echo "User Pool ID: $USER_POOL_ID"
    
    # Update client configuration with User Pool ID
    sed -i.bak "s/USER_POOL_ID_PLACEHOLDER/$USER_POOL_ID/g" aws-configs/cognito-user-pool-client.json
    
    # Create User Pool Client
    echo "Creating Cognito User Pool Client..."
    CLIENT_ID=$(aws cognito-idp create-user-pool-client \
        --user-pool-id $USER_POOL_ID \
        --cli-input-json file://aws-configs/cognito-user-pool-client.json \
        --region $REGION \
        --output text --query 'UserPoolClient.ClientId')
    
    echo "Client ID: $CLIENT_ID"
    
    # Create User Pool Domain
    echo "Creating Cognito Domain..."
    COGNITO_DOMAIN="${SERVICE_NAME}-auth-${RANDOM}"
    aws cognito-idp create-user-pool-domain \
        --domain $COGNITO_DOMAIN \
        --user-pool-id $USER_POOL_ID \
        --region $REGION
    
    echo "Cognito Domain: ${COGNITO_DOMAIN}.auth.${REGION}.amazoncognito.com"
    
    echo -e "${GREEN}✅ Cognito authentication setup completed${NC}"
}

# Setup SSL Certificate
setup_ssl_certificate() {
    echo -e "${YELLOW}🔒 Setting up SSL certificate...${NC}"
    
    # Request certificate
    CERT_ARN=$(aws acm request-certificate \
        --cli-input-json file://infrastructure/certificate-config.json \
        --region $REGION \
        --output text --query 'CertificateArn')
    
    echo "Certificate ARN: $CERT_ARN"
    echo "⚠️  Please validate the certificate in Route 53 before continuing"
    
    echo -e "${GREEN}✅ SSL certificate requested${NC}"
}

# Deploy frontend
deploy_frontend() {
    echo -e "${YELLOW}🌐 Deploying frontend application...${NC}"
    
    cd frontend
    
    # Install dependencies  
    echo "Installing frontend dependencies..."
    npm ci --production=false
    
    # Initialize Amplify (if not already done)
    if [ ! -f "amplify/.config/project-config.json" ]; then
        echo "Initializing Amplify project..."
        amplify init --yes
    fi
    
    # Add hosting
    echo "Configuring Amplify hosting..."
    amplify add hosting
    
    # Publish to Amplify
    echo "Publishing to AWS Amplify..."
    amplify publish --yes
    
    cd ..
    
    echo -e "${GREEN}✅ Frontend deployment completed${NC}"
}

# Configure Route 53 DNS
setup_dns() {
    echo -e "${YELLOW}🌍 Configuring DNS records...${NC}"
    
    # Get hosted zone ID
    ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name c6group.co.za --output text --query 'HostedZones[0].Id' | cut -d'/' -f3)
    
    if [ -z "$ZONE_ID" ]; then
        echo -e "${RED}❌ Hosted zone for c6group.co.za not found${NC}"
        exit 1
    fi
    
    echo "Hosted Zone ID: $ZONE_ID"
    
    # Update DNS records
    echo "Updating DNS records..."
    aws route53 change-resource-record-sets \
        --hosted-zone-id $ZONE_ID \
        --change-batch file://infrastructure/route53-config.json
    
    echo -e "${GREEN}✅ DNS configuration completed${NC}"
}

# Main deployment function
main() {
    echo -e "${BLUE}Starting deployment process...${NC}"
    
    # Check prerequisites
    check_prerequisites
    
    # Deploy backend
    API_URL=$(deploy_backend)
    
    # Setup Cognito
    setup_cognito
    
    # Setup SSL certificate  
    setup_ssl_certificate
    
    # Deploy frontend
    deploy_frontend
    
    # Setup DNS
    setup_dns
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✨ C6Group.AI OS v1.0 - SUPERAAI Control System is now live!${NC}"
    echo -e "${BLUE}🌐 Frontend URL: https://${DOMAIN_NAME}${NC}"
    echo -e "${BLUE}🔧 API Endpoint: ${API_URL}${NC}"
    echo -e "${BLUE}🔐 User Pool ID: ${USER_POOL_ID}${NC}"
    echo -e "${BLUE}🆔 Client ID: ${CLIENT_ID}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Run deployment
main "$@"