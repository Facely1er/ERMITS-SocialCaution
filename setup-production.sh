#!/bin/bash

# ERMITS Social Caution - Production Setup Script
# This script helps prepare your application for production deployment

set -e

echo "🚀 ERMITS Social Caution - Production Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then
  echo -e "${RED}Please do not run this script as root${NC}"
  exit 1
fi

echo -e "${BLUE}Step 1: Generating Production Secrets${NC}"
echo "--------------------------------------"

# Generate JWT secrets
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
JWT_REFRESH_SECRET=$(openssl rand -base64 64 | tr -d '\n')

echo -e "${GREEN}✓ JWT secrets generated${NC}"

# Backend environment file
echo -e "${BLUE}Step 2: Creating Backend Production Environment${NC}"
echo "------------------------------------------------"

read -p "Enter your MongoDB URI (e.g., mongodb+srv://...): " MONGODB_URI
read -p "Enter your frontend URL (e.g., https://yourdomain.com): " FRONTEND_URL
read -p "Enter your domain/API URL (e.g., https://api.yourdomain.com): " API_URL

# Optional email configuration
read -p "Configure email? (y/n): " CONFIGURE_EMAIL

if [ "$CONFIGURE_EMAIL" = "y" ]; then
  read -p "SMTP Host: " SMTP_HOST
  read -p "SMTP Port (default 587): " SMTP_PORT
  SMTP_PORT=${SMTP_PORT:-587}
  read -p "SMTP User/Email: " SMTP_USER
  read -sp "SMTP Password: " SMTP_PASS
  echo ""
  read -p "From Email: " FROM_EMAIL
  read -p "From Name: " FROM_NAME
fi

# Create backend .env.production
cat > backend/.env.production << EOF
# ERMITS Social Caution - Production Environment
# Generated on: $(date)

NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=${MONGODB_URI}

# JWT Secrets
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_REFRESH_EXPIRE=30d

# Frontend
FRONTEND_URL=${FRONTEND_URL}

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

EOF

if [ "$CONFIGURE_EMAIL" = "y" ]; then
  cat >> backend/.env.production << EOF
# Email Configuration
SMTP_HOST=${SMTP_HOST}
SMTP_PORT=${SMTP_PORT}
SMTP_USER=${SMTP_USER}
SMTP_PASS=${SMTP_PASS}
FROM_EMAIL=${FROM_EMAIL}
FROM_NAME=${FROM_NAME}

EOF
fi

echo -e "${GREEN}✓ Backend .env.production created${NC}"

# Frontend environment file
echo -e "${BLUE}Step 3: Creating Frontend Production Environment${NC}"
echo "-------------------------------------------------"

cat > .env.production << EOF
# ERMITS Social Caution Frontend - Production
# Generated on: $(date)

VITE_API_URL=${API_URL}/api
VITE_APP_NAME=ERMITS Social Caution
VITE_APP_ENV=production
EOF

echo -e "${GREEN}✓ Frontend .env.production created${NC}"

# Create systemd service files
echo -e "${BLUE}Step 4: Creating Systemd Service Files (Optional)${NC}"
echo "--------------------------------------------------"

read -p "Create systemd service files? (y/n): " CREATE_SERVICES

if [ "$CREATE_SERVICES" = "y" ]; then
  read -p "Enter the full path to project directory (e.g., /var/www/ermits-social-caution): " PROJECT_PATH
  read -p "Enter the user to run the service as: " SERVICE_USER

  # Backend service
  sudo tee /etc/systemd/system/ermits-backend.service > /dev/null << EOF
[Unit]
Description=ERMITS Social Caution Backend
After=network.target mongodb.service

[Service]
Type=simple
User=${SERVICE_USER}
WorkingDirectory=${PROJECT_PATH}/backend
Environment="NODE_ENV=production"
EnvironmentFile=${PROJECT_PATH}/backend/.env.production
ExecStart=/usr/bin/node src/server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

  echo -e "${GREEN}✓ Backend systemd service created${NC}"

  # Enable and start service
  sudo systemctl daemon-reload
  sudo systemctl enable ermits-backend
  echo -e "${YELLOW}To start backend: sudo systemctl start ermits-backend${NC}"
fi

# Security checklist
echo ""
echo -e "${BLUE}Step 5: Security Checklist${NC}"
echo "-------------------------"
echo "Please ensure:"
echo "  [ ] MongoDB has authentication enabled"
echo "  [ ] Database user has minimal required permissions"
echo "  [ ] Firewall is configured (ufw or iptables)"
echo "  [ ] SSL certificates are installed and configured"
echo "  [ ] All secrets are kept secure and not committed to Git"
echo "  [ ] Regular backups are scheduled"
echo ""

# Installation instructions
echo -e "${BLUE}Step 6: Next Steps${NC}"
echo "------------------"
echo "1. Install dependencies:"
echo "   cd backend && npm install --production"
echo "   cd .. && npm install"
echo ""
echo "2. Seed the database:"
echo "   cd backend && node src/database/seedPersonas.js"
echo ""
echo "3. Build frontend:"
echo "   npm run build"
echo ""
echo "4. Start services:"
echo "   PM2: pm2 start backend/src/server.js --name ermits-backend"
echo "   Systemd: sudo systemctl start ermits-backend"
echo ""
echo "5. Configure Nginx (see PRODUCTION_DEPLOYMENT.md)"
echo ""
echo "6. Test deployment:"
echo "   curl ${API_URL}/health"
echo ""

echo -e "${GREEN}Production setup complete! 🎉${NC}"
echo "See PRODUCTION_DEPLOYMENT.md for detailed deployment instructions"
echo ""

# Save summary
cat > .production-setup-summary.txt << EOF
ERMITS Social Caution - Production Setup Summary
Generated: $(date)

Backend URL: ${API_URL}
Frontend URL: ${FRONTEND_URL}
MongoDB: ${MONGODB_URI%%@*}@***

Files created:
- backend/.env.production
- .env.production
$(if [ "$CREATE_SERVICES" = "y" ]; then echo "- /etc/systemd/system/ermits-backend.service"; fi)

Next steps: See output above or PRODUCTION_DEPLOYMENT.md
EOF

echo -e "${YELLOW}Setup summary saved to .production-setup-summary.txt${NC}"
