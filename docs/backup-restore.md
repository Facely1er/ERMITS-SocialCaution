# Database Backup and Restore Guide

This guide explains how to backup and restore databases for the Social Caution platform.

## Automated Backups

### MongoDB Backups

The backup script supports automated MongoDB backups:

```bash
# Backup MongoDB
./scripts/backup-database.sh mongodb

# Backup with custom directory
./scripts/backup-database.sh mongodb --backup-dir=/path/to/backups

# Backup without compression (faster, larger files)
./scripts/backup-database.sh mongodb --no-compress
```

### Supabase Backups

Supabase backups are handled through the Supabase dashboard:

1. Go to Supabase Dashboard > Settings > Database
2. Click "Backups" tab
3. Create manual backup or configure automated backups

Alternatively, use pg_dump if you have direct database access:

```bash
pg_dump "postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres" > backup.sql
```

## Scheduling Automated Backups

### Using Cron (Linux/macOS)

Add to crontab for daily backups at 2 AM:

```bash
0 2 * * * /path/to/scripts/backup-database.sh all
```

### Using Task Scheduler (Windows)

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger to daily at 2 AM
4. Set action to run: `bash /path/to/scripts/backup-database.sh all`

### Using Docker

Add to docker-compose.yml:

```yaml
services:
  backup:
    image: mongo:7.0
    volumes:
      - ./backups:/backups
      - ./scripts:/scripts
    command: /scripts/backup-database.sh mongodb
    environment:
      - MONGO_HOST=mongodb
      - MONGO_DATABASE=social-caution
      - MONGO_ROOT_USERNAME=${MONGO_ROOT_USERNAME}
      - MONGO_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
    depends_on:
      - mongodb
    restart: "no"
```

## Restore Procedures

### Restore MongoDB Backup

```bash
# Restore from archive
mongorestore --host=localhost:27017 \
             --username=your_username \
             --password=your_password \
             --authenticationDatabase=admin \
             --db=social-caution \
             --archive=backups/mongodb_social-caution_20240101_020000.archive \
             --gzip
```

### Restore Supabase Backup

1. Go to Supabase Dashboard > Settings > Database
2. Click "Backups" tab
3. Select backup to restore
4. Click "Restore"

Or using psql:

```bash
psql "postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres" < backup.sql
```

## Backup Retention

Backups are automatically cleaned up after the retention period (default: 30 days).

To change retention period:

```bash
RETENTION_DAYS=60 ./scripts/backup-database.sh all
```

## Backup Verification

The backup script automatically verifies backups. To skip verification:

```bash
./scripts/backup-database.sh mongodb --no-verify
```

## Backup Storage

### Local Storage

Backups are stored in `./backups` by default. Ensure adequate disk space.

### Cloud Storage

For production, consider storing backups in cloud storage:

- **AWS S3**: Use `aws s3 sync` after backup
- **Google Cloud Storage**: Use `gsutil cp` after backup
- **Azure Blob Storage**: Use `az storage blob upload` after backup

Example script to upload to S3:

```bash
#!/bin/bash
./scripts/backup-database.sh all
aws s3 sync ./backups s3://your-bucket/backups/ --delete
```

## Disaster Recovery

### Full System Restore

1. Restore MongoDB backup
2. Restore Supabase backup (if applicable)
3. Restore application files
4. Restore environment variables
5. Restart services

### Partial Restore

To restore specific collections/tables:

```bash
# MongoDB - restore specific collection
mongorestore --db=social-caution \
             --collection=users \
             --archive=backup.archive \
             --gzip
```

## Best Practices

1. **Regular Backups**: Daily backups for production
2. **Offsite Storage**: Store backups in different location
3. **Test Restores**: Regularly test restore procedures
4. **Encryption**: Encrypt backups containing sensitive data
5. **Monitoring**: Monitor backup success/failure
6. **Documentation**: Document restore procedures

## Troubleshooting

### Backup Fails

- Check database connectivity
- Verify credentials
- Check disk space
- Review logs for errors

### Restore Fails

- Verify backup file integrity
- Check database connectivity
- Ensure sufficient disk space
- Verify user permissions

## Support

For backup/restore issues, check:
- Database logs
- Backup script logs
- System logs

