# Troubleshooting Runbook

## Common Issues and Solutions

### Application Won't Start

**Symptoms:**
- Server fails to start
- Port already in use errors

**Solutions:**
1. Check if port is in use: `lsof -i :5000`
2. Check environment variables
3. Review startup logs
4. Verify dependencies installed

### Database Connection Issues

**Symptoms:**
- Connection timeout errors
- Authentication failures

**Solutions:**
1. Verify database is running
2. Check connection string
3. Verify credentials
4. Check network connectivity
5. Review firewall rules

### High Memory Usage

**Symptoms:**
- Application crashes
- Slow performance
- OOM errors

**Solutions:**
1. Check for memory leaks
2. Review recent changes
3. Increase memory limits
4. Optimize code
5. Consider scaling

### Slow Response Times

**Symptoms:**
- High latency
- Timeout errors

**Solutions:**
1. Check database queries
2. Review API calls
3. Check network latency
4. Review caching strategy
5. Consider CDN

## Diagnostic Commands

```bash
# Check application health
curl http://localhost:5000/health

# Check logs
tail -f backend/logs/combined.log

# Check database status
mongosh --eval "db.serverStatus()"

# Check system resources
top
df -h
free -h
```

## Log Locations

- Application logs: `backend/logs/`
- Nginx logs: `/var/log/nginx/`
- System logs: `/var/log/syslog`

