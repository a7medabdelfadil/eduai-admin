# Deployment Guide

This document provides instructions for deploying the EduAI employee website to different environments.

## Docker Deployment

The application includes a Dockerfile for containerized deployment.

### Building the Docker Image

```bash
docker build -t eduai-employee-website:latest .
```

### Running the Container

```bash
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=your_api_url eduai-employee-website:latest
```

### Environment Variables for Docker

When running the Docker container, provide all necessary environment variables:

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=your_api_url \
  -e NEXT_PUBLIC_COMETCHAT_APP_ID=your_cometchat_app_id \
  -e NEXT_PUBLIC_COMETCHAT_REGION=your_cometchat_region \
  -e NEXT_PUBLIC_COMETCHAT_AUTH_KEY=your_cometchat_auth_key \
  eduai-employee-website:latest
```

## Vercel Deployment

The application is optimized for deployment on Vercel.

### Deploying to Vercel

1. Connect your GitHub repository to Vercel
2. Configure the following settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `next build`
   - Output Directory: .next

### Environment Variables on Vercel

Configure the following environment variables in the Vercel dashboard:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_COMETCHAT_APP_ID`
- `NEXT_PUBLIC_COMETCHAT_REGION`
- `NEXT_PUBLIC_COMETCHAT_AUTH_KEY`

## CI/CD Pipeline

### GitHub Actions (Optional)

You can set up a GitHub Actions workflow for continuous integration and deployment:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

## Production Considerations

### Performance Optimization

- Enable Next.js image optimization
- Configure appropriate caching headers
- Use a CDN for static assets

### Security Best Practices

- Keep all dependencies updated
- Use environment variables for sensitive information
- Implement proper authentication and authorization
- Configure security headers using Next.js configuration

### Monitoring and Logging

- Implement application monitoring (e.g., Sentry)
- Set up performance monitoring
- Configure logging for debugging and audit purposes

## Rollback Strategy

If a deployment causes issues, you can roll back to a previous version:

### On Vercel:

- Go to the Deployments tab in your Vercel dashboard
- Find the last working deployment
- Click "..." and select "Promote to Production"

### With Docker:

- Tag your Docker images with version numbers
- Keep previous versions available
- Deploy the previous version when needed
