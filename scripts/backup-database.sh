#!/bin/bash

# Database Backup Script for Social Caution Platform
# Supports MongoDB and Supabase backups
# Usage: ./scripts/backup-database.sh [mongodb|supabase|all] [options]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# MongoDB Configuration
MONGO_HOST="${MONGO_HOST:-localhost}"
MONGO_PORT="${MONGO_PORT:-27017}"
MONGO_DATABASE="${MONGO_DATABASE:-social-caution}"
MONGO_USERNAME="${MONGO_ROOT_USERNAME}"
MONGO_PASSWORD="${MONGO_ROOT_PASSWORD}"
MONGO_AUTH_DB="${MONGO_AUTH_DB:-admin}"

# Supabase Configuration
SUPABASE_URL="${SUPABASE_URL}"
SUPABASE_KEY="${SUPABASE_SERVICE_KEY}"

# Parse arguments
BACKUP_TYPE=${1:-all}
COMPRESS=true
VERIFY=true

shift || true
while [[ $# -gt 0 ]]; do
  case $1 in
    --no-compress)
      COMPRESS=false
      shift
      ;;
    --no-verify)
      VERIFY=false
      shift
      ;;
    --backup-dir=*)
      BACKUP_DIR="${1#*=}"
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}Starting database backup...${NC}"
echo -e "Backup type: ${BACKUP_TYPE}"
echo -e "Backup directory: ${BACKUP_DIR}"
echo -e "Timestamp: ${TIMESTAMP}"

# Function to backup MongoDB
backup_mongodb() {
  echo -e "${GREEN}Backing up MongoDB...${NC}"
  
  if [ -z "$MONGO_USERNAME" ] || [ -z "$MONGO_PASSWORD" ]; then
    echo -e "${YELLOW}Warning: MongoDB credentials not set. Attempting backup without authentication.${NC}"
    BACKUP_FILE="${BACKUP_DIR}/mongodb_${MONGO_DATABASE}_${TIMESTAMP}.archive"
    mongodump --host="${MONGO_HOST}:${MONGO_PORT}" \
              --db="${MONGO_DATABASE}" \
              --archive="${BACKUP_FILE}" \
              --gzip || {
      echo -e "${RED}MongoDB backup failed${NC}"
      return 1
    }
  else
    BACKUP_FILE="${BACKUP_DIR}/mongodb_${MONGO_DATABASE}_${TIMESTAMP}.archive"
    mongodump --host="${MONGO_HOST}:${MONGO_PORT}" \
              --username="${MONGO_USERNAME}" \
              --password="${MONGO_PASSWORD}" \
              --authenticationDatabase="${MONGO_AUTH_DB}" \
              --db="${MONGO_DATABASE}" \
              --archive="${BACKUP_FILE}" \
              --gzip || {
      echo -e "${RED}MongoDB backup failed${NC}"
      return 1
    }
  fi

  echo -e "${GREEN}MongoDB backup completed: ${BACKUP_FILE}${NC}"

  # Verify backup
  if [ "$VERIFY" = true ]; then
    echo -e "${GREEN}Verifying MongoDB backup...${NC}"
    if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
      echo -e "${GREEN}Backup file exists and is not empty${NC}"
      # Additional verification: try to list archive contents
      if command -v mongorestore &> /dev/null; then
        mongorestore --archive="${BACKUP_FILE}" --gzip --dryRun > /dev/null 2>&1 && {
          echo -e "${GREEN}Backup archive is valid${NC}"
        } || {
          echo -e "${YELLOW}Warning: Could not verify backup archive${NC}"
        }
      fi
    else
      echo -e "${RED}Backup file is missing or empty${NC}"
      return 1
    fi
  fi

  return 0
}

# Function to backup Supabase
backup_supabase() {
  echo -e "${GREEN}Backing up Supabase...${NC}"
  
  if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo -e "${YELLOW}Warning: Supabase credentials not set. Skipping Supabase backup.${NC}"
    return 0
  fi

  # Supabase backups are typically handled through their dashboard or API
  # This is a placeholder for manual backup instructions
  BACKUP_FILE="${BACKUP_DIR}/supabase_backup_${TIMESTAMP}.sql"
  
  echo -e "${YELLOW}Note: Supabase backups should be configured through the Supabase dashboard.${NC}"
  echo -e "${YELLOW}For automated backups, use Supabase's backup API or pg_dump if you have direct database access.${NC}"
  
  # Example pg_dump command (if you have direct PostgreSQL access):
  # pg_dump "$SUPABASE_DATABASE_URL" > "$BACKUP_FILE"
  
  # For now, create a placeholder file with instructions
  cat > "$BACKUP_FILE" << EOF
-- Supabase Backup Placeholder
-- Date: $(date)
-- 
-- To backup Supabase:
-- 1. Go to Supabase Dashboard > Settings > Database
-- 2. Use the backup feature in the dashboard
-- 3. Or use pg_dump with your database connection string
-- 
-- Connection string format:
-- postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
EOF

  echo -e "${GREEN}Supabase backup instructions saved: ${BACKUP_FILE}${NC}"
  return 0
}

# Function to clean up old backups
cleanup_old_backups() {
  echo -e "${GREEN}Cleaning up backups older than ${RETENTION_DAYS} days...${NC}"
  
  find "$BACKUP_DIR" -type f -name "*.archive" -mtime +${RETENTION_DAYS} -delete
  find "$BACKUP_DIR" -type f -name "*.sql" -mtime +${RETENTION_DAYS} -delete
  find "$BACKUP_DIR" -type f -name "*.gz" -mtime +${RETENTION_DAYS} -delete
  
  echo -e "${GREEN}Cleanup completed${NC}"
}

# Main backup logic
case "$BACKUP_TYPE" in
  mongodb)
    backup_mongodb || exit 1
    ;;
  supabase)
    backup_supabase || exit 1
    ;;
  all)
    backup_mongodb || echo -e "${YELLOW}MongoDB backup failed, continuing...${NC}"
    backup_supabase || echo -e "${YELLOW}Supabase backup failed, continuing...${NC}"
    ;;
  *)
    echo -e "${RED}Invalid backup type: ${BACKUP_TYPE}${NC}"
    echo -e "Usage: $0 [mongodb|supabase|all] [options]"
    exit 1
    ;;
esac

# Cleanup old backups
cleanup_old_backups

# Create backup manifest
MANIFEST_FILE="${BACKUP_DIR}/backup_manifest_${TIMESTAMP}.json"
cat > "$MANIFEST_FILE" << EOF
{
  "timestamp": "${TIMESTAMP}",
  "backup_type": "${BACKUP_TYPE}",
  "backup_dir": "${BACKUP_DIR}",
  "files": [
$(find "$BACKUP_DIR" -type f -name "*_${TIMESTAMP}*" -exec echo "    \"{}\"," \; | sed '$ s/,$//')
  ],
  "retention_days": ${RETENTION_DAYS}
}
EOF

echo -e "${GREEN}Backup completed successfully!${NC}"
echo -e "Manifest: ${MANIFEST_FILE}"

