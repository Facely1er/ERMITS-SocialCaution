#!/bin/bash

# ERMITS Social Caution MVP - Quick Start Script
# This script helps you quickly launch the MVP

set -e  # Exit on error

echo "🚀 Starting ERMITS Social Caution MVP..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo -e "${BLUE}Checking MongoDB...${NC}"
if ! pgrep -x mongod > /dev/null; then
    echo -e "${YELLOW}MongoDB is not running.${NC}"
    echo -e "${YELLOW}Starting MongoDB with Docker...${NC}"

    # Start MongoDB with Docker Compose
    docker-compose -f docker-compose.mvp.yml up -d mongodb

    echo -e "${GREEN}Waiting for MongoDB to be ready...${NC}"
    sleep 10
else
    echo -e "${GREEN}MongoDB is already running.${NC}"
fi

# Check if backend dependencies are installed
echo ""
echo -e "${BLUE}Checking backend dependencies...${NC}"
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd backend
    npm install --legacy-peer-deps
    cd ..
else
    echo -e "${GREEN}Backend dependencies already installed.${NC}"
fi

# Check if .env exists in backend
echo ""
echo -e "${BLUE}Checking backend configuration...${NC}"
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Creating backend .env file...${NC}"
    cat > backend/.env << 'EOF'
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ermits-social-caution
JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-characters-long
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-change-this-min-32-characters-long
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
EOF
    echo -e "${GREEN}Backend .env file created.${NC}"
else
    echo -e "${GREEN}Backend .env file already exists.${NC}"
fi

# Check if database is seeded
echo ""
echo -e "${BLUE}Checking database...${NC}"
DB_COUNT=$(mongosh --quiet --eval "db.getSiblingDB('ermits-social-caution').personas.countDocuments()" 2>/dev/null || echo "0")
if [ "$DB_COUNT" -eq "0" ]; then
    echo -e "${YELLOW}Seeding database with personas and RSS feeds...${NC}"
    cd backend
    node src/database/seedPersonas.js
    cd ..
    echo -e "${GREEN}Database seeded successfully.${NC}"
else
    echo -e "${GREEN}Database already seeded ($DB_COUNT personas found).${NC}"
fi

# Check if frontend dependencies are installed
echo ""
echo -e "${BLUE}Checking frontend dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}Frontend dependencies already installed.${NC}"
fi

# Check if .env.local exists
echo ""
echo -e "${BLUE}Checking frontend configuration...${NC}"
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF
    echo -e "${GREEN}.env.local file created.${NC}"
else
    echo -e "${GREEN}.env.local file already exists.${NC}"
fi

# Switch to MVP version
echo ""
echo -e "${BLUE}Switching to MVP version...${NC}"
if [ -f "src/main.mvp.tsx" ]; then
    # Backup original main.tsx if not already backed up
    if [ ! -f "src/main.tsx.backup" ]; then
        cp src/main.tsx src/main.tsx.backup
    fi
    cp src/main.mvp.tsx src/main.tsx
    echo -e "${GREEN}Switched to MVP version (main.tsx updated).${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}Starting services...${NC}"
echo ""
echo -e "${YELLOW}Opening backend in a new terminal...${NC}"
echo -e "${YELLOW}Opening frontend in a new terminal...${NC}"
echo ""

# Start backend in background
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend in background
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}🎉 ERMITS Social Caution MVP is starting!${NC}"
echo ""
echo -e "${BLUE}Access the application:${NC}"
echo -e "  Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend API: ${GREEN}http://localhost:5000${NC}"
echo -e "  Health Check: ${GREEN}http://localhost:5000/health${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for user to press Ctrl+C
wait $BACKEND_PID $FRONTEND_PID
