# Deployment Guide - Risk Acceptance Review System

This guide covers deploying the Risk Acceptance Review System to various platforms, with specific focus on GitLab + Rabbit Deploy.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] **Supabase Account**: Created and project configured
- [ ] **Database Tables**: `supabase-setup.sql` executed successfully
- [ ] **Storage Buckets**: Created (`ra-presentation`, `correspondence`, `supporting-evidence`)
- [ ] **Storage Policies**: `storage-policies.sql` applied
- [ ] **Environment Variables**: Noted your Supabase URL and Anon Key
- [ ] **Code Repository**: Code pushed to GitLab/GitHub
- [ ] **Build Test**: Verified `pnpm run build` works locally

---

## 🚀 GitLab + Rabbit Deploy (Recommended for Enterprise)

### Step 1: Prepare Your GitLab Repository

1. **Push code to GitLab**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Risk Acceptance Review System"
   git remote add origin <your-gitlab-repo-url>
   git push -u origin main
   ```

2. **Verify files are present**:
   - ✅ `package.json`
   - ✅ `.gitlab-ci.yml`
   - ✅ `.env.example` (but NOT `.env`)
   - ✅ `supabase-setup.sql`
   - ✅ `storage-policies.sql`
   - ✅ All `src/` files

### Step 2: Configure GitLab CI/CD Variables

1. Navigate to your GitLab project
2. Go to **Settings → CI/CD → Variables**
3. Click **Add Variable** and create these:

| Variable Name | Value | Protected | Masked |
|--------------|-------|-----------|---------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | ✅ | ❌ |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key-here` | ✅ | ✅ |

**Important**: 
- Mark as **Protected** for production branches
- Mark anon key as **Masked** to hide in logs
- DO NOT commit these to `.env` file

### Step 3: Configure Deployment Target

The `.gitlab-ci.yml` file is pre-configured but needs your deployment commands.

**Edit the `deploy` job** based on your hosting:

#### Option A: Deploy to Netlify

```yaml
deploy:
  stage: deploy
  image: node:18-alpine
  before_script:
    - npm install -g netlify-cli
  script:
    - netlify deploy --prod --dir=dist --auth=$NETLIFY_AUTH_TOKEN --site=$NETLIFY_SITE_ID
  environment:
    name: production
    url: https://your-app.netlify.app
```

**Required Variables**:
- `NETLIFY_AUTH_TOKEN` (get from Netlify account settings)
- `NETLIFY_SITE_ID` (get from site settings)

#### Option B: Deploy to Vercel

```yaml
deploy:
  stage: deploy
  image: node:18-alpine
  before_script:
    - npm install -g vercel
  script:
    - vercel --prod --token=$VERCEL_TOKEN --yes
  environment:
    name: production
    url: https://your-app.vercel.app
```

**Required Variables**:
- `VERCEL_TOKEN` (get from Vercel account settings)

#### Option C: Deploy to AWS S3 + CloudFront

```yaml
deploy:
  stage: deploy
  image: node:18-alpine
  before_script:
    - apk add --no-cache aws-cli
  script:
    - aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
    - aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
    - aws configure set region $AWS_REGION
    - aws s3 sync dist/ s3://$S3_BUCKET --delete
    - aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
  environment:
    name: production
    url: https://your-cloudfront-url.com
```

**Required Variables**:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (e.g., `ap-southeast-1`)
- `S3_BUCKET` (e.g., `my-risk-app`)
- `CLOUDFRONT_DISTRIBUTION_ID`

#### Option D: Deploy to Custom Server via SSH

```yaml
deploy:
  stage: deploy
  image: node:18-alpine
  before_script:
    - apk add --no-cache openssh-client rsync
    - mkdir -p ~/.ssh
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ssh-keyscan -H $SERVER_HOST >> ~/.ssh/known_hosts
  script:
    - rsync -avz --delete dist/ $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH
  environment:
    name: production
    url: https://your-server.com
```

**Required Variables**:
- `SSH_PRIVATE_KEY` (your private SSH key)
- `SERVER_HOST` (e.g., `server.example.com`)
- `SERVER_USER` (e.g., `deploy`)
- `DEPLOY_PATH` (e.g., `/var/www/risk-app`)

### Step 4: Trigger Deployment

1. **Push to main branch**:
   ```bash
   git push origin main
   ```

2. **Monitor pipeline**:
   - Go to **CI/CD → Pipelines** in GitLab
   - Watch the build process

3. **Manual deployment** (if configured):
   - Click **Deploy** button in pipeline view
   - Confirm deployment to production

### Step 5: Verify Deployment

1. **Check application loads**: Visit your production URL
2. **Test Supabase connection**: 
   - Upload a test file
   - Check if it appears in Supabase Storage
3. **Verify environment variables**: Check browser console for connection errors

---

## 🌐 Alternative Deployment Options

### Vercel (Simple, Fast)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add environment variables** in Vercel dashboard:
   - Project Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

### Netlify (Simple, Great for SPAs)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build**:
   ```bash
   pnpm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Configure environment**:
   - Site Settings → Environment Variables
   - Add Supabase credentials

### Docker (Containerized)

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm@8
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Build and run**:
```bash
docker build -t risk-assessment-app .
docker run -p 80:80 \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=your-key \
  risk-assessment-app
```

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings in Supabase

If you get CORS errors:

1. Go to Supabase Dashboard → Settings → API
2. Add your deployment URL to **Site URL**
3. Add to **Redirect URLs** if using auth

### 2. Configure Custom Domain (Optional)

#### Vercel:
- Domains → Add Domain → Follow DNS setup

#### Netlify:
- Domain Settings → Add custom domain → Update DNS

#### AWS CloudFront:
- Add alternate domain name (CNAME)
- Configure SSL certificate (ACM)
- Update DNS records

### 3. Enable HTTPS

- ✅ **Vercel/Netlify**: Automatic
- ✅ **AWS CloudFront**: Configure ACM certificate
- ✅ **Custom Server**: Use Let's Encrypt + Certbot

### 4. Set Up Monitoring

- **Supabase Logs**: Dashboard → Logs & Analytics
- **Application Errors**: Browser console / Sentry
- **Uptime Monitoring**: UptimeRobot, Pingdom, etc.

---

## 🐛 Troubleshooting

### Build Fails in CI/CD

**Error: `Cannot find module 'vite'`**
- Solution: Clear cache and reinstall
  ```yaml
  script:
    - rm -rf node_modules
    - pnpm install --frozen-lockfile
    - pnpm run build
  ```

**Error: `VITE_SUPABASE_URL is not defined`**
- Solution: Verify CI/CD variables are set correctly
- Check variable names match exactly (case-sensitive)

### Deployment Succeeds But App Shows Blank Page

1. **Check browser console** for errors
2. **Verify environment variables** are set in hosting platform
3. **Check build output**:
   ```bash
   ls -la dist/
   # Should contain index.html, assets/, etc.
   ```

### Supabase Connection Errors

1. **Verify credentials** in `.env` or hosting platform
2. **Check CORS settings** in Supabase dashboard
3. **Test connection locally first**:
   ```bash
   curl https://your-project.supabase.co/rest/v1/
   ```

### Files Not Uploading

1. **Check storage bucket policies** - re-run `storage-policies.sql`
2. **Verify bucket names** match code (case-sensitive)
3. **Check RLS policies** in Supabase dashboard

---

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Self-Hosting](https://supabase.com/docs/guides/self-hosting)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

---

## ✅ Deployment Checklist

Before going live:

- [ ] Environment variables configured
- [ ] Supabase database tables created
- [ ] Storage buckets created and policies applied
- [ ] Build tested locally (`pnpm run build`)
- [ ] CI/CD pipeline tested
- [ ] Production deployment successful
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled
- [ ] CORS configured in Supabase
- [ ] Test file upload functionality
- [ ] Test demo mode works
- [ ] Monitor logs for errors
- [ ] Backup Supabase database
- [ ] Document deployment URLs and credentials (securely)

---

**Need Help?** Check logs, review error messages, and verify each step above. Most deployment issues are due to missing environment variables or incorrect Supabase configuration.
