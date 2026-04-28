# 18_Deployment_Architecture.md

# MB Tech Labs - Deployment Architecture

## Overview

The deployment architecture for MB Tech Labs is designed to ensure high availability, scalability, and cost-effectiveness. The system utilizes Vercel for frontend hosting and Hostinger VPS for backend and database, with comprehensive monitoring, backup, and security measures.

## Hosting Infrastructure

### Frontend Deployment (Vercel)
- **Platform**: Vercel serverless platform
- **Global CDN**: Worldwide content delivery
- **Automatic Scaling**: Serverless auto-scaling
- **Custom Domains**: Domain management and SSL
- **Preview Deployments**: Branch-based preview environments

### Backend Deployment (Hostinger VPS)
- **Server Type**: Virtual Private Server
- **Operating System**: Ubuntu 22.04 LTS
- **Resources**: Configurable CPU, RAM, storage
- **Network**: High-speed internet connection
- **Backup**: Automated backup solutions

### Database Hosting
- **Location**: Same VPS as backend for low latency
- **Engine**: MySQL 8.0+
- **Storage**: SSD storage for performance
- **Replication**: Future read replica capability

## Production Architecture

### Application Architecture
```
Internet
    │
    ├─► Vercel (Frontend)
    │   ├── Global CDN
    │   ├── Serverless Functions
    │   └── Static Assets
    │
    └─► Hostinger VPS (Backend)
        ├── Nginx (Reverse Proxy)
        ├── Gunicorn (WSGI Server)
        ├── Django Application
        ├── MySQL Database
        └── Redis Cache (Future)
```

### Network Architecture
- **Load Balancing**: Nginx handles request distribution
- **SSL Termination**: SSL certificates managed at Nginx level
- **Firewall**: UFW firewall configuration
- **DDoS Protection**: Basic DDoS mitigation
- **Monitoring**: Server resource monitoring

## Deployment Pipeline

### CI/CD Pipeline
```mermaid
graph LR
    A[Code Push] --> B[GitHub Actions]
    B --> C[Testing]
    C --> D[Build]
    D --> E[Deploy to Staging]
    E --> F[Integration Tests]
    F --> G[Deploy to Production]
    G --> H[Health Checks]
```

### Frontend Deployment
1. **Build Trigger**: Push to main branch or PR merge
2. **Build Process**: Vite production build
3. **Asset Optimization**: Code splitting and minification
4. **CDN Deployment**: Global content delivery
5. **Domain Update**: Automatic DNS updates

### Backend Deployment
1. **Code Deployment**: Git pull on VPS
2. **Dependency Installation**: pip install requirements
3. **Database Migration**: Django migrations
4. **Static Files**: Collect and serve static files
5. **Service Restart**: Gunicorn and Nginx restart

## Server Configuration

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/mbtechlabs
server {
    listen 80;
    server_name api.mbtechlabs.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.mbtechlabs.com;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/mbtechlabs.crt;
    ssl_certificate_key /etc/ssl/private/mbtechlabs.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /static/ {
        alias /var/www/mbtechlabs/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Media files
    location /media/ {
        alias /var/www/mbtechlabs/media/;
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

### Gunicorn Configuration
```python
# gunicorn.conf.py
bind = "127.0.0.1:8000"
workers = 3
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50
timeout = 30
keepalive = 2
user = "mbtechlabs"
group = "mbtechlabs"
tmp_upload_dir = None
```

### Systemd Service
```ini
# /etc/systemd/system/mbtechlabs.service
[Unit]
Description=MB Tech Labs Django Application
After=network.target

[Service]
User=mbtechlabs
Group=mbtechlabs
WorkingDirectory=/var/www/mbtechlabs
Environment="PATH=/var/www/mbtechlabs/venv/bin"
ExecStart=/var/www/mbtechlabs/venv/bin/gunicorn mbtechlabs.wsgi:application --config gunicorn.conf.py
Restart=always

[Install]
WantedBy=multi-user.target
```

## Database Configuration

### MySQL Optimization
```sql
-- MySQL configuration for performance
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
max_connections = 100
query_cache_size = 128M
query_cache_type = 1
```

### Backup Strategy
- **Daily Backups**: Automated daily database dumps
- **Weekly Full Backups**: Complete system backups
- **Off-site Storage**: Backups stored in cloud storage
- **Retention Policy**: 30-day retention for daily, 1-year for weekly
- **Encryption**: Encrypted backup files

## Security Measures

### Server Security
- **SSH Hardening**: Key-based authentication, disabled password login
- **Firewall**: UFW with minimal open ports
- **Fail2Ban**: Automated IP banning for suspicious activity
- **Regular Updates**: Automated security updates
- **Intrusion Detection**: Basic IDS monitoring

### Application Security
- **SSL/TLS**: End-to-end encryption
- **Security Headers**: OWASP recommended headers
- **Rate Limiting**: API rate limiting and DDoS protection
- **Input Validation**: Comprehensive input sanitization
- **Audit Logging**: Complete user action logging

## Monitoring and Alerting

### Server Monitoring
- **Resource Monitoring**: CPU, memory, disk usage
- **Service Monitoring**: Application and database health
- **Network Monitoring**: Bandwidth and connection monitoring
- **Log Monitoring**: Centralized log aggregation

### Application Monitoring
- **Performance Monitoring**: Response times and throughput
- **Error Tracking**: Application error monitoring
- **User Analytics**: Usage patterns and user behavior
- **API Monitoring**: Endpoint performance and errors

### Alerting System
- **Email Alerts**: Critical system alerts
- **SMS Alerts**: Emergency notifications
- **Slack Integration**: Team notifications
- **Dashboard Alerts**: Real-time dashboard notifications

## Scaling Strategy

### Vertical Scaling
- **Resource Upgrades**: CPU, RAM, storage increases
- **Database Optimization**: Query optimization and indexing
- **Caching Implementation**: Redis caching for performance
- **CDN Optimization**: Content delivery optimization

### Horizontal Scaling (Future)
- **Load Balancing**: Multiple backend servers
- **Database Replication**: Read replicas for scalability
- **Microservices**: Application modularization
- **Container Orchestration**: Docker/Kubernetes migration

## Backup and Recovery

### Backup Procedures
- **Automated Backups**: Scheduled backup scripts
- **Database Dumps**: mysqldump for database backups
- **File Backups**: Application and user file backups
- **Configuration Backups**: Server configuration backups

### Disaster Recovery
- **Recovery Time Objective (RTO)**: 4 hours
- **Recovery Point Objective (RPO)**: 1 hour
- **Failover Procedures**: Backup server activation
- **Data Restoration**: Automated recovery scripts

## Environment Management

### Development Environment
- **Local Development**: Docker-based local setup
- **Development Server**: Hot reloading and debugging
- **Database**: Local MySQL instance
- **Version Control**: Git-based development workflow

### Staging Environment
- **Staging Server**: VPS-based staging environment
- **Automated Deployment**: CI/CD to staging
- **Testing**: Integration and user acceptance testing
- **Data Synchronization**: Production data anonymization

### Production Environment
- **Production Server**: Optimized production VPS
- **Zero-downtime Deployment**: Rolling deployment strategy
- **Monitoring**: Comprehensive production monitoring
- **Backup**: Continuous backup procedures

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: Dynamic imports and lazy loading
- **Asset Optimization**: Minification and compression
- **Caching Strategy**: Browser and CDN caching
- **Image Optimization**: WebP format and responsive images

### Backend Optimization
- **Database Indexing**: Optimized query performance
- **Caching**: Application-level caching
- **Connection Pooling**: Database connection optimization
- **Async Processing**: Background task processing

## Cost Optimization

### Hosting Costs
- **Resource Right-sizing**: Optimal VPS configuration
- **CDN Usage**: Cost-effective content delivery
- **Storage Optimization**: Efficient file storage usage
- **Backup Optimization**: Cost-effective backup strategies

### Operational Costs
- **Automation**: Automated deployment and monitoring
- **Monitoring Efficiency**: Cost-effective monitoring solutions
- **Maintenance Optimization**: Efficient maintenance procedures

This deployment architecture provides a robust, scalable foundation for MB Tech Labs while maintaining cost-effectiveness and high availability.