# Alerting Configuration Guide

## Overview

This guide explains how to configure alerting for the Social Caution platform.

## Alert Rules

### Error Rate Alerts

**Rule:** Error rate > 5% for 5 minutes
**Severity:** High
**Action:** Notify on-call engineer

### Response Time Alerts

**Rule:** P95 response time > 1s for 10 minutes
**Severity:** Medium
**Action:** Notify team

### Health Check Failures

**Rule:** Health check fails for 2 consecutive checks
**Severity:** Critical
**Action:** Immediate notification

### Database Connection Alerts

**Rule:** Database connection failures > 3 in 5 minutes
**Severity:** High
**Action:** Notify on-call engineer

### Memory Usage Alerts

**Rule:** Memory usage > 90% for 5 minutes
**Severity:** Medium
**Action:** Notify team

## Notification Channels

### Email

Configure email alerts for:
- Critical incidents
- Daily summaries
- Weekly reports

### Slack

Configure Slack alerts for:
- All incidents
- Team notifications
- Status updates

### PagerDuty (Optional)

Configure PagerDuty for:
- Critical incidents
- On-call escalations

## Alert Configuration Examples

### Prometheus Alert Rules

```yaml
groups:
  - name: social_caution_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: high
        annotations:
          summary: "High error rate detected"
          
      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 10m
        labels:
          severity: medium
        annotations:
          summary: "Slow response times detected"
```

### Sentry Alerts

Configure in Sentry dashboard:
1. Go to Alerts
2. Create new alert rule
3. Set conditions (error rate, issue count, etc.)
4. Configure notification channels

## Testing Alerts

Test alerts regularly to ensure they work:

```bash
# Test health check alert
curl -X POST http://localhost:5000/api/test/trigger-alert

# Verify alert received
```

## Alert Runbooks

Each alert should have a corresponding runbook:
- Incident response procedures
- Troubleshooting steps
- Escalation procedures

See `docs/runbooks/` for detailed runbooks.

