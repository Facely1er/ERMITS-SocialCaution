# Log Aggregation Configuration Guide

## Overview

This guide explains how to configure log aggregation for the Social Caution platform.

## Current Logging Setup

The application uses Winston for structured logging:
- Error logs: `backend/logs/error.log`
- Combined logs: `backend/logs/combined.log`
- Log rotation: 5MB max size, 5 files retained

## Log Aggregation Options

### Option 1: ELK Stack (Elasticsearch, Logstash, Kibana)

**Setup:**
1. Install Elasticsearch
2. Install Logstash
3. Install Kibana
4. Configure log shipping

**Configuration:**
```yaml
# logstash.conf
input {
  file {
    path => "/path/to/backend/logs/*.log"
    type => "social-caution"
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "social-caution-%{+YYYY.MM.dd}"
  }
}
```

### Option 2: Datadog

**Setup:**
1. Create Datadog account
2. Install Datadog agent
3. Configure log collection

**Configuration:**
```yaml
# datadog.yaml
logs_enabled: true
logs_config:
  container_collect_all: true
```

### Option 3: CloudWatch (AWS)

**Setup:**
1. Configure CloudWatch Logs
2. Install CloudWatch agent
3. Set up log groups

**Configuration:**
```json
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/path/to/backend/logs/*.log",
            "log_group_name": "social-caution",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  }
}
```

## Structured Logging

Logs are structured in JSON format:

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "level": "error",
  "message": "Error message",
  "errorId": "err_1234567890_abc123",
  "url": "/api/endpoint",
  "method": "POST",
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0..."
}
```

## Log Retention

- **Development:** 7 days
- **Staging:** 30 days
- **Production:** 90 days

## Log-Based Alerts

Configure alerts based on log patterns:

- Error rate spikes
- Authentication failures
- Database connection errors
- Security events

## Best Practices

1. **Structured Logging:** Use JSON format
2. **Log Levels:** Use appropriate levels (error, warn, info, debug)
3. **Sensitive Data:** Never log passwords, tokens, or PII
4. **Performance:** Use async logging for production
5. **Retention:** Configure appropriate retention policies

## Monitoring Logs

### Key Metrics to Monitor

- Error rate
- Warning rate
- Log volume
- Log processing latency

### Dashboards

Create dashboards for:
- Error trends
- Request patterns
- Performance metrics
- Security events

