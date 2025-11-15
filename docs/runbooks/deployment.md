# Deployment Runbook

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code review completed
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Backup created
- [ ] Rollback plan prepared

## Deployment Steps

### 1. Staging Deployment

```bash
# Deploy to staging
./scripts/deploy.sh staging

# Verify deployment
curl https://staging.socialcaution.com/health
```

### 2. Production Deployment

```bash
# Deploy to production
./scripts/deploy.sh production

# Verify deployment
curl https://socialcaution.com/health
```

### 3. Post-Deployment Verification

- [ ] Health checks passing
- [ ] Key features working
- [ ] No error spikes in logs
- [ ] Performance metrics normal

## Rollback Procedure

If deployment fails:

```bash
# Rollback to previous version
./scripts/rollback.sh production [version]
```

## Emergency Rollback

1. Identify last known good version
2. Execute rollback script
3. Verify service restored
4. Investigate issue

## Database Migrations

1. Test migration on staging
2. Backup production database
3. Run migration
4. Verify data integrity
5. Monitor for issues

