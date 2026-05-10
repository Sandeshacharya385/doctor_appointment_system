# Doctor Appointment System - Deployment Guide

## Overview
This guide will help you deploy your application so it's accessible from any device.

## Recommended Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend) - RECOMMENDED
**Best for**: Quick deployment, free tier available, production-ready

#### Frontend Deployment (Vercel)
1. **Sign up for Vercel**: https://vercel.com
2. **Import your frontend repository**:
   - Click "Add New Project"
   - Import from GitHub: `doctor_appointment_system`
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (or leave default)
   
3. **Environment Variables**:
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
   ```
   (You'll get this URL after deploying backend)

4. **Deploy**: Click "Deploy"
   - Build time: ~2-3 minutes
   - You'll get a URL like: `https://doctor-appointment-system.vercel.app`

#### Backend Deployment (Railway)
1. **Sign up for Railway**: https://railway.app
2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `doctor_appointment_system_backend`

3. **Add PostgreSQL Database**:
   - In your project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will auto-provision and connect it

4. **Environment Variables**:
   Add in Railway dashboard:
   ```
   DEBUG=False
   SECRET_KEY=your-secret-key-here-generate-new-one
   ALLOWED_HOSTS=your-app-name.railway.app
   CORS_ALLOWED_ORIGINS=https://doctor-appointment-system.vercel.app,http://localhost:3000
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

5. **Add Procfile** (if not exists):
   Create `backend/Procfile`:
   ```
   web: gunicorn doctor_appointment.wsgi --bind 0.0.0.0:$PORT
   release: python manage.py migrate
   ```

6. **Add runtime.txt**:
   Create `backend/runtime.txt`:
   ```
   python-3.11.0
   ```

7. **Update requirements.txt**:
   Add these if missing:
   ```
   gunicorn
   psycopg2-binary
   whitenoise
   ```

8. **Deploy**: Railway will auto-deploy
   - You'll get a URL like: `https://your-app.railway.app`

---

### Option 2: Netlify (Frontend) + Render (Backend)
**Alternative free option**

#### Frontend (Netlify)
1. Sign up: https://netlify.com
2. Import GitHub repo
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables
5. Deploy

#### Backend (Render)
1. Sign up: https://render.com
2. New Web Service
3. Connect GitHub repo
4. Build command: `pip install -r requirements.txt`
5. Start command: `gunicorn doctor_appointment.wsgi:application`
6. Add PostgreSQL database
7. Add environment variables
8. Deploy

---

### Option 3: Local Network Access (Quick Test)
**For testing on same WiFi network**

#### Backend
1. Find your local IP:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Update `backend/.env`:
   ```
   ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.100
   CORS_ALLOWED_ORIGINS=http://192.168.1.100:3000,http://localhost:3000
   ```

3. Start backend:
   ```bash
   cd backend
   python manage.py runserver 0.0.0.0:8000
   ```

#### Frontend
1. Update `frontend/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://192.168.1.100:8000/api
   ```

2. Start frontend:
   ```bash
   cd frontend
   npm run dev -- -H 0.0.0.0
   ```

3. Access from other laptop:
   - Open browser: `http://192.168.1.100:3000`
   - Both devices must be on same WiFi

---

## Step-by-Step: Deploy to Vercel + Railway (RECOMMENDED)

### Step 1: Prepare Backend for Deployment

1. **Update settings.py**:
   ```python
   # Add to backend/doctor_appointment/settings.py
   
   import os
   from pathlib import Path
   
   # SECURITY WARNING: keep the secret key used in production secret!
   SECRET_KEY = os.environ.get('SECRET_KEY', 'your-dev-secret-key')
   
   # SECURITY WARNING: don't run with debug turned on in production!
   DEBUG = os.environ.get('DEBUG', 'True') == 'True'
   
   ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
   
   # CORS
   CORS_ALLOWED_ORIGINS = os.environ.get(
       'CORS_ALLOWED_ORIGINS',
       'http://localhost:3000'
   ).split(',')
   
   # Database
   import dj_database_url
   DATABASES = {
       'default': dj_database_url.config(
           default='sqlite:///db.sqlite3',
           conn_max_age=600
       )
   }
   
   # Static files
   STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
   STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
   
   # Middleware - add whitenoise
   MIDDLEWARE = [
       'django.middleware.security.SecurityMiddleware',
       'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this
       # ... rest of middleware
   ]
   ```

2. **Update requirements.txt**:
   ```bash
   cd backend
   pip install gunicorn whitenoise dj-database-url psycopg2-binary
   pip freeze > requirements.txt
   ```

3. **Create Procfile**:
   ```bash
   cd backend
   echo "web: gunicorn doctor_appointment.wsgi --bind 0.0.0.0:\$PORT" > Procfile
   echo "release: python manage.py migrate" >> Procfile
   ```

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Prepare backend for deployment"
   git push origin main
   ```

### Step 2: Deploy Backend to Railway

1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `doctor_appointment_system_backend`
4. Click "Add variables" and add:
   ```
   DEBUG=False
   SECRET_KEY=django-insecure-generate-a-new-secret-key-here-use-random-string
   ALLOWED_HOSTS=*.railway.app
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
5. Add PostgreSQL:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway auto-connects it
6. Click "Deploy"
7. Copy your Railway URL (e.g., `https://doctor-appointment-backend.railway.app`)

### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up
2. Click "Add New Project"
3. Import `doctor_appointment_system` from GitHub
4. Root Directory: leave as `./`
5. Framework: Next.js (auto-detected)
6. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   ```
   (Use the Railway URL from Step 2)
7. Click "Deploy"
8. Wait 2-3 minutes
9. Copy your Vercel URL (e.g., `https://doctor-appointment-system.vercel.app`)

### Step 4: Update Backend CORS

1. Go back to Railway dashboard
2. Update `CORS_ALLOWED_ORIGINS` variable:
   ```
   CORS_ALLOWED_ORIGINS=https://doctor-appointment-system.vercel.app
   ```
   (Use your actual Vercel URL)
3. Railway will auto-redeploy

### Step 5: Test Your Deployment

1. Open your Vercel URL in browser
2. Try to register/login
3. Test all features

---

## Troubleshooting

### Backend Issues
- **500 Error**: Check Railway logs for errors
- **Database Error**: Ensure PostgreSQL is connected
- **CORS Error**: Update CORS_ALLOWED_ORIGINS with correct frontend URL
- **Static Files**: Run `python manage.py collectstatic` in Railway console

### Frontend Issues
- **API Connection Failed**: Check NEXT_PUBLIC_API_URL is correct
- **Build Failed**: Check build logs in Vercel
- **Environment Variables**: Ensure they're set in Vercel dashboard

### Common Fixes
1. **Clear build cache**: Redeploy in Vercel/Railway
2. **Check logs**: Both platforms have detailed logs
3. **Environment variables**: Double-check all URLs and keys
4. **HTTPS**: Ensure backend URL uses HTTPS in production

---

## Cost Breakdown

### Free Tier Limits
- **Vercel**: Unlimited deployments, 100GB bandwidth/month
- **Railway**: $5 free credit/month (~500 hours)
- **Render**: 750 hours/month free
- **Netlify**: 100GB bandwidth/month

### Recommended for Production
- **Vercel Pro**: $20/month (better performance)
- **Railway**: Pay as you go (~$5-10/month)
- **Total**: ~$20-30/month for production-ready hosting

---

## Security Checklist

Before deploying:
- [ ] Generate new SECRET_KEY for production
- [ ] Set DEBUG=False
- [ ] Update ALLOWED_HOSTS
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Set up database backups
- [ ] Configure proper authentication

---

## Next Steps After Deployment

1. **Custom Domain** (Optional):
   - Buy domain from Namecheap/GoDaddy
   - Add to Vercel: Settings → Domains
   - Update backend CORS with new domain

2. **Monitoring**:
   - Set up error tracking (Sentry)
   - Monitor uptime (UptimeRobot)
   - Check performance (Vercel Analytics)

3. **Backups**:
   - Railway: Automatic PostgreSQL backups
   - Export data regularly

4. **CI/CD**:
   - Already set up! Push to GitHub = auto-deploy

---

## Quick Start Commands

### Deploy Backend to Railway
```bash
cd backend
# Install dependencies
pip install gunicorn whitenoise dj-database-url psycopg2-binary
pip freeze > requirements.txt

# Create Procfile
echo "web: gunicorn doctor_appointment.wsgi --bind 0.0.0.0:\$PORT" > Procfile

# Commit and push
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Deploy Frontend to Vercel
```bash
cd frontend
# Ensure .env.local is in .gitignore (it should be)
# Environment variables will be set in Vercel dashboard

# Commit any changes
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## Support

If you encounter issues:
1. Check deployment logs in Railway/Vercel
2. Verify environment variables
3. Test API endpoints directly
4. Check CORS configuration
5. Review Django settings.py

## Estimated Deployment Time
- Backend setup: 15-20 minutes
- Frontend setup: 5-10 minutes
- Testing: 10 minutes
- **Total**: ~30-40 minutes

Good luck with your deployment! 🚀
