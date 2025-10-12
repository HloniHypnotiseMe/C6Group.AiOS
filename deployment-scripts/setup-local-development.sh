#!/bin/bash

# C6Group.AI OS v1.0 – SUPERAAI System Initialization
# Local Development Setup Script
# 
# Description: Setup local development environment
# Author: C6Group.AI Development Team
# Version: 1.0.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏗️  C6Group.AI OS v1.0 - Local Development Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check Node.js version
check_node_version() {
    echo -e "${YELLOW}🔍 Checking Node.js version...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18 or higher.${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js version 18 or higher is required. Current version: $(node --version)${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js version $(node --version) is compatible${NC}"
}

# Setup frontend
setup_frontend() {
    echo -e "${YELLOW}⚛️  Setting up React frontend...${NC}"
    
    cd frontend
    
    # Install dependencies
    echo "Installing frontend dependencies..."
    npm install
    
    # Create environment file
    if [ ! -f ".env" ]; then
        echo "Creating frontend .env file..."
        cp .env.example .env
        echo -e "${YELLOW}📝 Please update frontend/.env with your configuration${NC}"
    fi
    
    cd ..
    
    echo -e "${GREEN}✅ Frontend setup completed${NC}"
}

# Setup backend
setup_backend() {
    echo -e "${YELLOW}🔧 Setting up Node.js backend...${NC}"
    
    cd backend
    
    # Install dependencies
    echo "Installing backend dependencies..."
    npm install
    
    # Create environment file
    if [ ! -f ".env" ]; then
        echo "Creating backend .env file..."
        cp .env.example .env
        echo -e "${YELLOW}📝 Please update backend/.env with your configuration${NC}"
    fi
    
    cd ..
    
    echo -e "${GREEN}✅ Backend setup completed${NC}"
}

# Install global dependencies
install_global_tools() {
    echo -e "${YELLOW}🌐 Installing global development tools...${NC}"
    
    # Check if running with appropriate permissions
    if ! npm list -g serverless &> /dev/null; then
        echo "Installing Serverless Framework..."
        npm install -g serverless
    fi
    
    if ! npm list -g @aws-amplify/cli &> /dev/null; then
        echo "Installing AWS Amplify CLI..."
        npm install -g @aws-amplify/cli
    fi
    
    echo -e "${GREEN}✅ Global tools installed${NC}"
}

# Setup Git hooks (optional)
setup_git_hooks() {
    echo -e "${YELLOW}📋 Setting up Git hooks...${NC}"
    
    # Pre-commit hook for linting
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
# C6Group.AI OS - Pre-commit hook

echo "🔍 Running pre-commit checks..."

# Check frontend
if [ -d "frontend" ]; then
    cd frontend
    if [ -f "package.json" ]; then
        npm run lint --silent
        if [ $? -ne 0 ]; then
            echo "❌ Frontend linting failed"
            exit 1
        fi
    fi
    cd ..
fi

# Check backend  
if [ -d "backend" ]; then
    cd backend
    if [ -f "package.json" ]; then
        npm run lint --silent
        if [ $? -ne 0 ]; then
            echo "❌ Backend linting failed"
            exit 1
        fi
    fi
    cd ..
fi

echo "✅ Pre-commit checks passed"
EOF

    chmod +x .git/hooks/pre-commit
    echo -e "${GREEN}✅ Git hooks configured${NC}"
}

# Create development scripts
create_dev_scripts() {
    echo -e "${YELLOW}📜 Creating development scripts...${NC}"
    
    # Create start-dev script
    cat > start-dev.sh << 'EOF'
#!/bin/bash
# Start local development servers

echo "🚀 Starting C6Group.AI OS development servers..."

# Function to kill background processes on exit
cleanup() {
    echo "Stopping development servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}
trap cleanup INT TERM

# Start backend
cd backend
echo "Starting backend server on port 3001..."
npm run dev &
BACKEND_PID=$!

# Start frontend  
cd ../frontend
echo "Starting frontend server on port 3000..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001"
echo "📊 Health Check: http://localhost:3001/health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait
EOF

    chmod +x start-dev.sh
    
    # Create build script
    cat > build-all.sh << 'EOF'
#!/bin/bash
# Build all components

echo "🔨 Building C6Group.AI OS components..."

# Build frontend
echo "Building frontend..."
cd frontend
npm run build

# Build backend
echo "Building backend..."
cd ../backend  
npm run build

echo "✅ All components built successfully!"
EOF

    chmod +x build-all.sh
    
    echo -e "${GREEN}✅ Development scripts created${NC}"
}

# Display next steps
show_next_steps() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 Local development setup completed!${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📋 Next Steps:${NC}"
    echo -e "${BLUE}1. Configure environment variables:${NC}"
    echo -e "   - Update frontend/.env with your settings"
    echo -e "   - Update backend/.env with your AWS credentials"
    echo -e "${BLUE}2. Start development servers:${NC}"
    echo -e "   ./start-dev.sh"
    echo -e "${BLUE}3. Open your browser:${NC}"
    echo -e "   http://localhost:3000"
    echo -e "${BLUE}4. Build for production:${NC}"
    echo -e "   ./build-all.sh"
    echo -e "${BLUE}5. Deploy to AWS:${NC}"
    echo -e "   ./deployment-scripts/deploy-infrastructure.sh"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Main setup function
main() {
    check_node_version
    install_global_tools
    setup_backend
    setup_frontend
    setup_git_hooks
    create_dev_scripts
    show_next_steps
}

# Run setup
main "$@"