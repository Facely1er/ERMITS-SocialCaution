#!/bin/bash

# Rollback script for Social Caution Platform
# Usage: ./scripts/rollback.sh [environment] [version]
# Example: ./scripts/rollback.sh production v1.2.3

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-production}
VERSION=${2:-previous}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
  echo -e "${RED}Error: Environment must be 'staging' or 'production'${NC}"
  exit 1
fi

echo -e "${YELLOW}WARNING: This will rollback ${ENVIRONMENT} to version ${VERSION}${NC}"
read -p "Are you sure you want to continue? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo -e "${RED}Rollback cancelled.${NC}"
  exit 1
fi

echo -e "${GREEN}Starting rollback of ${ENVIRONMENT} to ${VERSION}...${NC}"

# Create backup of current deployment
echo -e "${GREEN}Creating backup of current deployment...${NC}"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)_${ENVIRONMENT}"
mkdir -p "$BACKUP_DIR"
# Add backup commands here based on your deployment method

# Rollback commands (customize based on your hosting platform)
echo -e "${GREEN}Rolling back to version ${VERSION}...${NC}"

# Example rollback commands (customize for your platform):
# - Git: git checkout ${VERSION} && npm run build && deploy
# - Docker: docker pull your-image:${VERSION} && docker-compose up -d
# - Platform-specific: Use platform CLI to rollback

echo -e "${YELLOW}Add your rollback commands here${NC}"

# Health check after rollback
echo -e "${GREEN}Running post-rollback health check...${NC}"
# Add health check script here
# Example: curl -f https://your-domain.com/health || {
#   echo -e "${RED}Health check failed. Consider restoring from backup.${NC}"
#   exit 1
# }

echo -e "${GREEN}Rollback to ${VERSION} completed successfully!${NC}"
echo -e "${YELLOW}Backup saved to: ${BACKUP_DIR}${NC}"

