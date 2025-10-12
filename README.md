# C6Group.AI OS v1.0 – SUPERAAI Control System

[![AWS Certified](https://img.shields.io/badge/AWS-Certified-orange)](https://aws.amazon.com)
[![Production Ready](https://img.shields.io/badge/Production-Ready-green)](https://github.com/HloniHypnotiseMe/C6Group.AiOS)

## 🚀 Mission
Operational skeleton for **C6Group.AI OS v1.0** (codename "SUPERAAI Control System") - A production-ready system that allows the founder to command and monitor three AI agents:

- **Architect.AI** – System design and creative strategy  
- **Executor.AI** – Coding and deployment  
- **Observer.AI** – Analytics and learning feedback  

## 🛠 Tech Stack
- **Frontend**: React + TailwindCSS (dark-gold neo-spiritual theme)
- **Backend**: Node.js (Express) → AWS Lambda via Serverless
- **Database**: DynamoDB  
- **Auth**: AWS Cognito  
- **Hosting**: AWS Amplify (frontend), API Gateway + Lambda (backend)
- **Domain**: os.c6group.co.za (Route 53 + ACM SSL)

## 📁 Repository Structure
```
/frontend          # React app with TailwindCSS
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # App.jsx, Login.jsx, Dashboard.jsx
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API connectors (Axios)
│   ├── styles/        # TailwindCSS configurations
│   └── utils/         # Helper functions
└── public/           # Static assets

/backend           # Node.js Express → Lambda
├── api/
│   ├── architect/     # Architect.AI endpoints
│   ├── executor/      # Executor.AI endpoints
│   └── observer/      # Observer.AI endpoints
├── middleware/        # Authentication & validation
├── utils/            # DynamoDB helpers
└── config/           # Environment configurations

/infrastructure    # AWS deployment configs
├── amplify.yml       # Amplify hosting configuration
├── serverless.yml    # Serverless Lambda deployment
├── route53-config.json
└── certificate-config.json

/aws-configs       # AWS service configurations
/deployment-scripts # Automated deployment scripts
/tests            # Unit and integration tests
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

### 2. Environment Setup
```bash
# Copy and configure environment variables
cp backend/.env.example backend/.env
# Edit .env with your AWS credentials and configurations
```

### 3. Local Development
```bash
# Start frontend (React dev server)
cd frontend && npm run dev

# Start backend (Express server)
cd backend && npm run dev
```

### 4. Build for Production
```bash
# Frontend build
cd frontend && npm run build

# Backend build (Lambda packages)
cd backend && npm run build
```

## 🌐 Deployment Guide

### Prerequisites
- AWS CLI configured with appropriate permissions
- Node.js 18+ and npm
- Serverless Framework installed globally
- AWS Amplify CLI installed

### Step 1: Deploy Backend (Serverless)
```bash
cd backend
serverless deploy --stage production
```

### Step 2: Deploy Frontend (Amplify)
```bash
cd frontend
amplify init
amplify push
```

### Step 3: Configure Domain (Route 53)
```bash
# Apply Route 53 configurations
aws route53 change-resource-record-sets --hosted-zone-id YOUR_ZONE_ID --change-batch file://infrastructure/route53-config.json

# Request SSL certificate
aws acm request-certificate --domain-name os.c6group.co.za --validation-method DNS
```

### Step 4: Connect Domain to Amplify
```bash
amplify add hosting
amplify publish
```

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```env
# AWS Configuration
AWS_REGION=us-east-1
DYNAMO_TABLE=c6group-superaai-table
COGNITO_USER_POOL_ID=your_user_pool_id
COGNITO_CLIENT_ID=your_client_id
API_GATEWAY_URL=https://your-api-id.execute-api.region.amazonaws.com/prod

# AI Services
OPENAI_KEY=your_openai_api_key
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0

# Application
NODE_ENV=production
CORS_ORIGIN=https://os.c6group.co.za
JWT_SECRET=your_jwt_secret_key
```

## 🎨 Theme Configuration

The application uses a dark-gold neo-spiritual theme:
- **Background**: #0b0b0b (Deep Black)
- **Primary**: #e5b90b (Golden)
- **Secondary**: #1a1a1a (Dark Gray)
- **Accent**: #f4d03f (Light Gold)

## 📊 AI Agent Integration

Each AI agent has dedicated endpoints:

### Architect.AI
- `POST /api/architect/design` - System architecture planning
- `GET /api/architect/templates` - Design templates
- `POST /api/architect/analyze` - Project analysis

### Executor.AI
- `POST /api/executor/deploy` - Code deployment
- `GET /api/executor/status` - Deployment status
- `POST /api/executor/rollback` - Rollback operations

### Observer.AI
- `GET /api/observer/analytics` - System analytics
- `POST /api/observer/feedback` - Learning feedback
- `GET /api/observer/insights` - Performance insights

## 🔒 Security Features

- AWS Cognito authentication
- JWT token validation
- CORS protection
- Environment variable encryption
- DynamoDB IAM roles
- API Gateway rate limiting

## 📈 Monitoring & Logging

- CloudWatch integration
- Real-time agent status monitoring
- Performance metrics dashboard
- Error tracking and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

Copyright © 2024 C6Group.AI. All rights reserved.

## 🆘 Support

For support and questions, contact the C6Group.AI development team.

---

**Built with ❤️ by C6Group.AI for the SUPERAAI Control System**