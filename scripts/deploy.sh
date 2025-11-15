#!/bin/bash

# Deployment script for Social Caution Platform
# Usage: ./scripts/deploy.sh [environment] [options]
# Example: ./scripts/deploy.sh production --dry-run

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-staging}
DRY_RUN=false
SKIP_TESTS=false
SKIP_BUILD=false

# Parse arguments
shift || true
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --skip-tests)
      SKIP_TESTS=true
      shift
      ;;
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
  echo -e "${RED}Error: Environment must be 'staging' or 'production'${NC}"
  exit 1
fi

echo -e "${GREEN}Starting deployment to ${ENVIRONMENT}...${NC}"

# Check if .env file exists
if [ ! -f ".env.${ENVIRONMENT}" ] && [ ! -f ".env" ]; then
  echo -e "${YELLOW}Warning: No .env file found. Make sure environment variables are set.${NC}"
fi

# Run tests unless skipped
if [ "$SKIP_TESTS" = false ]; then
  echo -e "${GREEN}Running tests...${NC}"
  npm run test:run || {
    echo -e "${RED}Tests failed. Aborting deployment.${NC}"
    exit 1
  }
fi

# Build application unless skipped
if [ "$SKIP_BUILD" = false ]; then
  echo -e "${GREEN}Building application...${NC}"
  if [ "$ENVIRONMENT" = "production" ]; then
    npm run build:production || {
      echo -e "${RED}Build failed. Aborting deployment.${NC}"
      exit 1
    }
  else
    npm run build || {
      echo -e "${RED}Build failed. Aborting deployment.${NC}"
      exit 1
    }
  fi
fi

# Validate production build
if [ "$ENVIRONMENT" = "production" ]; then
  echo -e "${GREEN}Running production validation...${NC}"
  npm run production-check || {
    echo -e "${RED}Production validation failed. Aborting deployment.${NC}"
    exit 1
  }
fi

# Deployment commands (customize based on your hosting platform)
if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}DRY RUN: Would deploy to ${ENVIRONMENT}${NC}"
  echo -e "${YELLOW}Deployment commands would be executed here${NC}"
else
  echo -e "${GREEN}Deploying to ${ENVIRONMENT}...${NC}"
  
  # Example deployment commands (customize for your platform):
  # - Netlify: netlify deploy --prod --dir=dist
  # - Vercel: vercel --prod
  # - AWS S3: aws s3 sync dist/ s3://your-bucket --delete
  # - SSH: rsync -avz dist/ user@server:/var/www/html/
  
  echo -e "${YELLOW}Add your deployment commands here${NC}"
fi

# Health check
if [ "$DRY_RUN" = false ]; then
  echo -e "${GREEN}Running post-deployment health check...${NC}"
  # Add health check script here
  # Example: curl -f https://your-domain.com/health || exit 1
fi

echo -e "${GREEN}Deployment to ${ENVIRONMENT} completed successfully!${NC}"

