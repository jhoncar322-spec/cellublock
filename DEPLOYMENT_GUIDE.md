# CelluBlock Deployment Guide

This guide covers deploying the CelluBlock platform to production.

## Prerequisites

- Node.js 18+ installed on the server
- MongoDB database (local or cloud like MongoDB Atlas)
- Domain name (optional but recommended)
- SSL certificate (for HTTPS)

## Deployment Options

### Option 1: Traditional VPS/Server Deployment

#### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install -y nginx

# Install MongoDB (if not using cloud)
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Step 2: Clone and Setup

```bash
# Clone repository
git clone https://github.com/jhoncar322-spec/cellublock.git
cd cellublock

# Backend setup
cd backend
npm install
npm run build

# Create production .env
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cellublock
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
EOF

# Seed first admin
npm run seed:admin

# Frontend setup
cd ../frontend
npm install
npm run build
```

#### Step 3: Configure PM2

```bash
# Backend
cd ~/cellublock/backend
pm2 start dist/server.js --name cellublock-backend

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/cellublock
```

Add the following configuration:

```nginx
# Backend API
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Frontend
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /home/ubuntu/cellublock/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/cellublock /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com
```

### Option 2: Docker Deployment

#### Dockerfile for Backend

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

#### Dockerfile for Frontend

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json;
}
```

#### Docker Compose

Create `docker-compose.yml` in the root:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: cellublock-mongodb
    restart: always
    environment:
      MONGO_INITDB_DATABASE: cellublock
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    container_name: cellublock-backend
    restart: always
    environment:
      PORT: 5000
      MONGODB_URI: mongodb://mongodb:27017/cellublock
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRE: 7d
      NODE_ENV: production
      CORS_ORIGIN: http://localhost:3000
    ports:
      - "5000:5000"
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: cellublock-frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Deploy with Docker Compose:

```bash
# Create .env file with secrets
echo "JWT_SECRET=$(openssl rand -base64 32)" > .env

# Start all services
docker-compose up -d

# Seed admin (one-time)
docker-compose exec backend npm run seed:admin

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: Cloud Platform Deployment

#### Heroku

**Backend:**

```bash
cd backend

# Create Procfile
echo "web: node dist/server.js" > Procfile

# Deploy
heroku create cellublock-api
heroku addons:create mongolab
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set NODE_ENV=production
git push heroku main
```

**Frontend:**

```bash
cd frontend

# Build
npm run build

# Deploy to Netlify/Vercel
# - Upload dist folder
# - Set VITE_API_URL to your Heroku backend URL
```

#### AWS EC2

Similar to VPS deployment, but use AWS-specific features:

- EC2 instance for backend
- S3 + CloudFront for frontend static hosting
- DocumentDB or MongoDB Atlas for database
- Route53 for DNS
- Certificate Manager for SSL

#### DigitalOcean App Platform

- Create app from GitHub repository
- Configure environment variables
- DigitalOcean will auto-deploy on push

## Environment Variables

### Backend Production Variables

```env
PORT=5000
MONGODB_URI=mongodb://your-mongo-host:27017/cellublock
JWT_SECRET=<strong-random-secret-min-32-chars>
JWT_EXPIRE=7d
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Production Variables

```env
VITE_API_URL=https://api.your-domain.com/api
```

## Security Checklist

- [ ] Use HTTPS (SSL/TLS)
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable MongoDB authentication
- [ ] Implement rate limiting
- [ ] Set up firewall (UFW/iptables)
- [ ] Regular security updates
- [ ] Backup database regularly
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for your domain
- [ ] Implement request size limits
- [ ] Add security headers (helmet.js)
- [ ] Monitor for vulnerabilities (npm audit)

## Monitoring

### PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs cellublock-backend

# Restart on crash (auto-configured)
pm2 startup
pm2 save
```

### Logging

Add logging to backend:

```bash
npm install winston
```

Update server to use structured logging.

### Health Checks

The API includes a health check endpoint:

```
GET /health
```

Set up monitoring tools like:
- UptimeRobot
- Pingdom
- AWS CloudWatch
- New Relic

## Backup Strategy

### Database Backup

```bash
# Manual backup
mongodump --db cellublock --out /backup/$(date +%Y%m%d)

# Automated daily backup
crontab -e
0 2 * * * mongodump --db cellublock --out /backup/$(date +\%Y\%m\%d)

# Restore
mongorestore --db cellublock /backup/20260213/cellublock
```

### MongoDB Atlas Automated Backups

If using MongoDB Atlas, enable automated backups in the dashboard.

## Scaling

### Horizontal Scaling

- Use load balancer (Nginx, HAProxy, AWS ELB)
- Run multiple backend instances
- Use PM2 cluster mode:

```bash
pm2 start dist/server.js -i max --name cellublock-backend
```

### Database Scaling

- MongoDB replica sets for high availability
- Sharding for large datasets
- Read replicas for read-heavy workloads

### Caching

Add Redis for caching:

```bash
npm install redis
```

Cache frequently accessed data:
- Device status
- Statistics
- Audit logs

## Updates and Maintenance

### Updating the Application

```bash
# Pull latest code
cd ~/cellublock
git pull

# Update backend
cd backend
npm install
npm run build
pm2 restart cellublock-backend

# Update frontend
cd ../frontend
npm install
npm run build
# Nginx will serve the new files automatically
```

### Database Migrations

For schema changes, create migration scripts in `backend/migrations/`

## Cost Estimation

### Small Deployment (< 1000 devices)

- **VPS**: $5-10/month (DigitalOcean/Linode)
- **MongoDB Atlas**: $0 (free tier) - $9/month
- **Domain**: $10-15/year
- **SSL**: $0 (Let's Encrypt)
- **Total**: ~$15-30/month

### Medium Deployment (1000-10000 devices)

- **VPS**: $20-40/month
- **MongoDB Atlas**: $25-50/month
- **CDN**: $5-10/month
- **Total**: ~$50-100/month

### Large Deployment (10000+ devices)

- **Cloud Infrastructure**: $200-500/month
- **Managed MongoDB**: $100-300/month
- **CDN + Load Balancer**: $50-100/month
- **Monitoring**: $50-100/month
- **Total**: ~$400-1000/month

## Troubleshooting Production Issues

### Backend crashes

```bash
# Check PM2 logs
pm2 logs cellublock-backend --lines 100

# Check system resources
top
df -h
```

### High CPU usage

```bash
# Monitor Node.js processes
pm2 monit

# Check slow database queries
# In MongoDB shell
db.setProfilingLevel(2)
db.system.profile.find().limit(5).sort({ts: -1}).pretty()
```

### Memory leaks

```bash
# Restart backend
pm2 restart cellublock-backend

# Monitor memory usage
pm2 monit
```

## Support

For issues and questions:
- GitHub Issues: https://github.com/jhoncar322-spec/cellublock/issues
- Documentation: See README.md and API_DOCUMENTATION.md
