# Nginx SSL/TLS Configuration Guide

This guide explains how to set up SSL/TLS certificates for the Social Caution platform using Nginx.

## Prerequisites

- Nginx installed and configured
- Domain name pointing to your server
- Root or sudo access to the server

## Option 1: Let's Encrypt (Recommended)

### Installation

1. Install Certbot:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

### Obtain Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will:
- Automatically obtain a certificate
- Configure Nginx to use the certificate
- Set up automatic renewal

### Auto-Renewal

Certbot sets up automatic renewal via cron. Test renewal:
```bash
sudo certbot renew --dry-run
```

## Option 2: Manual Certificate Installation

### 1. Obtain Certificate

Get your SSL certificate from your CA (Certificate Authority).

### 2. Install Certificate Files

Place certificate files in `/etc/nginx/ssl/`:
```bash
sudo mkdir -p /etc/nginx/ssl
sudo cp your-certificate.crt /etc/nginx/ssl/cert.pem
sudo cp your-private-key.key /etc/nginx/ssl/key.pem
sudo cp your-ca-bundle.crt /etc/nginx/ssl/chain.pem
```

### 3. Set Permissions

```bash
sudo chmod 600 /etc/nginx/ssl/key.pem
sudo chmod 644 /etc/nginx/ssl/cert.pem
sudo chmod 644 /etc/nginx/ssl/chain.pem
sudo chown root:root /etc/nginx/ssl/*
```

### 4. Update Nginx Configuration

The nginx.conf file is already configured with SSL settings. Update the server_name:
```nginx
server_name yourdomain.com www.yourdomain.com;
```

### 5. Test and Reload

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Configuration Details

The nginx configuration includes:

- **TLS Protocols**: Only TLS 1.2 and 1.3 (secure protocols)
- **Strong Cipher Suites**: Modern, secure ciphers
- **OCSP Stapling**: Improves SSL handshake performance
- **HSTS**: Forces HTTPS with preload support
- **Session Configuration**: Optimized for security and performance

## Verification

### Test SSL Configuration

```bash
# Test SSL Labs
https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com

# Test locally
openssl s_client -connect yourdomain.com:443 -tls1_2
```

### Check Certificate Expiry

```bash
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

## Troubleshooting

### Certificate Not Found

- Verify file paths in nginx.conf
- Check file permissions
- Ensure certificate files exist

### SSL Handshake Failed

- Verify certificate and key match
- Check certificate chain is complete
- Ensure firewall allows port 443

### OCSP Stapling Errors

- Verify chain.pem includes intermediate certificates
- Check resolver configuration
- Test with: `openssl s_client -connect yourdomain.com:443 -status`

## Security Best Practices

1. **Use Strong Certificates**: 2048-bit RSA or ECDSA
2. **Enable HSTS**: Already configured with preload
3. **Regular Renewal**: Set up automatic renewal
4. **Monitor Expiry**: Set up alerts for certificate expiration
5. **Disable Weak Protocols**: Only TLS 1.2 and 1.3 enabled

## Maintenance

### Renew Certificate (Let's Encrypt)

```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Check Certificate Status

```bash
sudo certbot certificates
```

## Additional Resources

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)

