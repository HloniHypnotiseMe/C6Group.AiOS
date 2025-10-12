# C6Group.AI OS v1.0 API Documentation

## 🤖 SUPERAAI Control System API Reference

Complete API documentation for the C6Group.AI OS v1.0 backend services.

**Base URL**: `https://api.os.c6group.co.za`  
**Version**: 1.0.0  
**Authentication**: AWS Cognito JWT Tokens

## 📑 Table of Contents

- [Authentication](#authentication)
- [System API](#system-api)
- [Agent Management API](#agent-management-api)
- [Architect.AI API](#architectai-api)
- [Executor.AI API](#executorai-api)
- [Observer.AI API](#observerai-api)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## 🔐 Authentication

All API endpoints require authentication using AWS Cognito JWT tokens.

### Headers Required

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Getting a Token

```javascript
// Using AWS Amplify (Frontend)
import { Auth } from '@aws-amplify/auth'

const token = (await Auth.currentSession()).getAccessToken().getJwtToken()
```

## 🖥️ System API

Base path: `/api/system`

### System Health Check

```http
GET /api/system/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-16T10:30:00Z",
    "version": "1.0.0",
    "uptime": 3600,
    "services": {
      "api": { "status": "healthy", "responseTime": "< 50ms" },
      "database": { "status": "healthy", "provider": "DynamoDB" },
      "auth": { "status": "healthy", "provider": "AWS Cognito" }
    }
  }
}
```

### System Metrics

```http
GET /api/system/metrics?timeRange=24h
```

**Response:**
```json
{
  "success": true,
  "data": {
    "timeRange": "24h",
    "system": {
      "cpu": { "current": 34, "average": 32, "peak": 67 },
      "memory": { "current": 56, "average": 54, "peak": 78 },
      "storage": { "used": "2.3 GB", "available": "47.7 GB" }
    },
    "performance": {
      "averageResponseTime": 245,
      "throughput": 1247,
      "errorRate": 0.12,
      "availability": 99.97
    }
  }
}
```

### System Activity Feed

```http
GET /api/system/activity?limit=50&agentId=architect&type=deployment
```

**Parameters:**
- `limit` (optional): Number of activities to return (default: 50)
- `agentId` (optional): Filter by specific agent
- `type` (optional): Filter by activity type
- `since` (optional): ISO timestamp to filter activities since

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "activityId": "550e8400-e29b-41d4-a716-446655440000",
      "agentId": "architect",
      "type": "design_created",
      "message": "New system architecture design generated",
      "severity": "info",
      "timestamp": "2024-01-16T10:30:00Z",
      "metadata": { "designId": "arch_001", "projectType": "web-app" }
    }
  ],
  "metadata": { "total": 1, "filters": { "limit": 50 } }
}
```

## 🤖 Agent Management API

Base path: `/api/agents`

### Get All Agents Status

```http
GET /api/agents/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "agents": {
      "architect": {
        "agentId": "architect",
        "name": "Architect.AI",
        "status": "online",
        "health": "healthy",
        "capabilities": ["System Architecture Design", "Creative Strategy"],
        "metrics": { "cpu": 15, "memory": 32, "load": 8 }
      }
    },
    "summary": {
      "totalAgents": 3,
      "onlineAgents": 2,
      "healthyAgents": 3,
      "systemHealth": "optimal"
    }
  }
}
```

### Execute Agent Command

```http
POST /api/agents/{agentId}/command
```

**Request Body:**
```json
{
  "command": "start",
  "parameters": {
    "priority": "high",
    "timeout": 30
  }
}
```

**Valid Commands:**
- `start` - Start the agent
- `stop` - Stop the agent  
- `pause` - Pause agent operations
- `restart` - Restart the agent
- `configure` - Update agent configuration

**Response:**
```json
{
  "success": true,
  "data": {
    "commandId": "cmd_550e8400-e29b-41d4-a716-446655440000",
    "agentId": "architect",
    "command": "start",
    "status": "initiated",
    "message": "Starting architect agent...",
    "estimatedDuration": "5-10 seconds"
  }
}
```

### Get Agent Metrics

```http
GET /api/agents/{agentId}/metrics?timeRange=1h
```

**Response:**
```json
{
  "success": true,
  "data": {
    "agentId": "architect",
    "timeRange": "1h",
    "dataPoints": [
      {
        "timestamp": "2024-01-16T10:30:00Z",
        "cpu": 25,
        "memory": 45,
        "load": 15,
        "requests": 120,
        "errors": 0,
        "responseTime": 180
      }
    ],
    "summary": {
      "avgCpu": 28,
      "avgMemory": 42,
      "totalRequests": 1440,
      "totalErrors": 2,
      "avgResponseTime": 165
    }
  }
}
```

## 🏗️ Architect.AI API

Base path: `/api/architect`

### Get Architect Status

```http
GET /api/architect/status
```

### Create Architecture Design

```http
POST /api/architect/design
```

**Request Body:**
```json
{
  "requirements": "E-commerce platform with user auth, product catalog, payment processing",
  "projectType": "web-application",
  "constraints": {
    "budget": "medium",
    "timeline": "6-weeks",
    "scalability": "high"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "designId": "design_550e8400-e29b-41d4-a716-446655440000",
    "architecture": {
      "frontend": {
        "technology": "React",
        "framework": "Next.js",
        "styling": "TailwindCSS"
      },
      "backend": {
        "technology": "Node.js",
        "framework": "Express",
        "database": "PostgreSQL"
      },
      "infrastructure": {
        "hosting": "AWS",
        "compute": "ECS Fargate",
        "storage": "S3"
      }
    },
    "estimatedComplexity": "Medium",
    "estimatedTimeframe": "4-6 weeks"
  }
}
```

### Get Design Templates

```http
GET /api/architect/templates
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "templateId": "web-app-template",
      "name": "Modern Web Application",
      "description": "Full-stack web application with React and Node.js",
      "category": "Web Development",
      "technologies": ["React", "Node.js", "PostgreSQL", "AWS"],
      "complexity": "Medium",
      "estimatedTime": "4-6 weeks"
    }
  ]
}
```

### Analyze Project

```http
POST /api/architect/analyze
```

**Request Body:**
```json
{
  "projectUrl": "https://github.com/company/project",
  "analysisType": "architecture_review"
}
```

## ⚡ Executor.AI API

Base path: `/api/executor`

### Get Executor Status

```http
GET /api/executor/status
```

### Deploy Application

```http
POST /api/executor/deploy
```

**Request Body:**
```json
{
  "environment": "production",
  "repository": "https://github.com/company/app.git",
  "branch": "main",
  "buildConfig": {
    "nodeVersion": "18",
    "buildCommand": "npm run build"
  },
  "environmentVars": {
    "NODE_ENV": "production",
    "API_URL": "https://api.company.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deploymentId": "deploy_550e8400-e29b-41d4-a716-446655440000",
    "status": "initiated",
    "steps": [
      { "name": "Source Code Checkout", "status": "pending" },
      { "name": "Build Process", "status": "pending" },
      { "name": "Application Deployment", "status": "pending" }
    ],
    "estimatedDuration": "8-12 minutes"
  }
}
```

### Get Deployment Status

```http
GET /api/executor/deployments/{deploymentId}
```

### Rollback Deployment

```http
POST /api/executor/rollback/{deploymentId}
```

**Request Body:**
```json
{
  "reason": "Critical bug detected in production"
}
```

### Get CI/CD Pipelines

```http
GET /api/executor/pipelines
```

### Trigger Pipeline

```http
POST /api/executor/pipelines/{pipelineId}/trigger
```

## 👁️ Observer.AI API

Base path: `/api/observer`

### Get Observer Status

```http
GET /api/observer/status
```

### Get System Analytics

```http
GET /api/observer/analytics?range=24h&metric=performance
```

**Parameters:**
- `range`: Time range (1h, 24h, 7d, 30d)
- `metric`: Specific metric (all, performance, usage, errors)

**Response:**
```json
{
  "success": true,
  "data": {
    "timeRange": "24h",
    "systemMetrics": {
      "performance": {
        "averageResponseTime": "245ms",
        "throughput": "1,247 req/min",
        "errorRate": "0.12%",
        "availability": "99.97%"
      }
    },
    "agentAnalytics": {
      "architect": {
        "tasksCompleted": 15,
        "averageTaskTime": "12m 30s",
        "successRate": 94.2
      }
    }
  }
}
```

### Submit Feedback

```http
POST /api/observer/feedback
```

**Request Body:**
```json
{
  "type": "performance_issue",
  "category": "response_time",
  "content": "API endpoints experiencing slower response times during peak hours",
  "severity": "medium",
  "metadata": {
    "endpoint": "/api/agents/status",
    "responseTime": "850ms"
  }
}
```

### Get Performance Insights

```http
GET /api/observer/insights
```

**Response:**
```json
{
  "success": true,
  "data": {
    "keyInsights": [
      {
        "type": "performance",
        "priority": "high",
        "title": "API Response Time Optimization Opportunity",
        "description": "Database queries can be optimized to reduce response time by ~30%",
        "confidence": 87,
        "recommendations": [
          "Implement connection pooling",
          "Add database query caching"
        ]
      }
    ],
    "predictions": {
      "nextWeek": {
        "expectedLoad": "High (+15%)",
        "resourceRequirements": "Scale up by 20%"
      }
    }
  }
}
```

### Get System Alerts

```http
GET /api/observer/alerts?status=active&severity=high
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "alertId": "alert_550e8400-e29b-41d4-a716-446655440000",
      "type": "performance",
      "severity": "high",
      "title": "High Response Time Detected",
      "message": "API response time exceeded threshold (>500ms)",
      "status": "active",
      "triggeredAt": "2024-01-16T14:25:00Z",
      "component": "api-gateway"
    }
  ]
}
```

### Acknowledge Alert

```http
POST /api/observer/alerts/{alertId}/acknowledge
```

**Request Body:**
```json
{
  "note": "Investigating the performance issue, scaling up resources"
}
```

## ❌ Error Handling

All API endpoints return standardized error responses:

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The provided data is invalid",
    "status": 400,
    "timestamp": "2024-01-16T10:30:00Z",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `AUTHENTICATION_ERROR` | 401 | Invalid or missing authentication token |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server internal error |
| `AWS_ERROR` | 500 | AWS service error |
| `AGENT_UNAVAILABLE` | 503 | AI agent temporarily unavailable |

## 🚦 Rate Limiting

API endpoints are rate-limited to ensure fair usage:

### Default Limits
- **General endpoints**: 100 requests per 15 minutes
- **Sensitive endpoints**: 5 requests per minute
- **Agent commands**: 10 requests per minute

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2024-01-16T10:45:00Z
Retry-After: 60
```

### Rate Limit Response

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "status": 429,
    "retryAfter": 60
  }
}
```

## 📝 API Client Examples

### JavaScript/Node.js

```javascript
class C6GroupAPI {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl
    this.token = token
  }

  async request(method, endpoint, data = null) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : null
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  // Agent management
  async getAgentsStatus() {
    return this.request('GET', '/api/agents/status')
  }

  async executeAgentCommand(agentId, command, parameters = {}) {
    return this.request('POST', `/api/agents/${agentId}/command`, {
      command,
      parameters
    })
  }

  // Architect.AI
  async createDesign(requirements, projectType) {
    return this.request('POST', '/api/architect/design', {
      requirements,
      projectType
    })
  }

  // Executor.AI
  async deployApplication(config) {
    return this.request('POST', '/api/executor/deploy', config)
  }

  // Observer.AI
  async getAnalytics(range = '24h') {
    return this.request('GET', `/api/observer/analytics?range=${range}`)
  }
}

// Usage
const api = new C6GroupAPI('https://api.os.c6group.co.za', 'your-jwt-token')
const status = await api.getAgentsStatus()
```

### Python

```python
import requests
import json

class C6GroupAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

    def request(self, method, endpoint, data=None):
        url = f"{self.base_url}{endpoint}"
        response = requests.request(
            method, 
            url, 
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()

    def get_agents_status(self):
        return self.request('GET', '/api/agents/status')

    def execute_agent_command(self, agent_id, command, parameters=None):
        return self.request('POST', f'/api/agents/{agent_id}/command', {
            'command': command,
            'parameters': parameters or {}
        })

# Usage
api = C6GroupAPI('https://api.os.c6group.co.za', 'your-jwt-token')
status = api.get_agents_status()
```

## 🔗 Webhooks

The system supports webhooks for real-time notifications:

### Webhook Events
- `agent.status.changed`
- `deployment.completed`
- `deployment.failed`
- `alert.triggered`
- `system.maintenance`

### Webhook Payload Example

```json
{
  "event": "deployment.completed",
  "timestamp": "2024-01-16T10:30:00Z",
  "data": {
    "deploymentId": "deploy_550e8400-e29b-41d4-a716-446655440000",
    "environment": "production",
    "status": "success",
    "duration": "8m 45s"
  },
  "signature": "sha256=abc123..."
}
```

---

**For more information, visit [docs.c6group.ai](https://docs.c6group.ai)**