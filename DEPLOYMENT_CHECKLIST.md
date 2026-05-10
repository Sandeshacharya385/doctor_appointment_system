# Deployment Checklist

## ✅ Pre-Deployment (Completed)

- [x] Added deployment dependencies to requirements.txt
  - gunicorn
  - whitenoise
  - dj-database-url
- [x] Created Procfile for Railway/Render
- [x] Created runtime.txt (Python 3.11)
- [x] Updated settings.py for production
  - WhiteNoise middleware
  - DATABASE_URL support
  - Static files configuration
- [x] Code pushed to GitHub

## 📋 Deployment Steps

### Option 1: Quick Deploy (Vercel + Railway) - 30 minutes

#### Backend (Railway) - 15 minutes
1. [ ] Go to https://railway.app
2. [ ] Sign up with GitHub
3. [ ] Click "New Project" → "Deploy from GitHub repo"
4. [ ] Select `doctor_appointment_system_backend`
5. [ ] Add PostgreSQL database:
   - Click "New" → "Database" → "PostgreSQL"
6. [ ] Add environment variables:
   ```
   DEBUG=False
   SECRET_KEY=<generate-new-secret-key>
   ALLOWED_HOSTS=*.railway.app
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
7. [ ] Wait for deployment (~5 minutes)
8. [ ] Copy Railway URL (e.g., `https://doctor-appointment-backend.railway.app`)
9. [ ] Test API: Open `https://your-backend.railway.app/api/schema/swagger-ui/`

#### Frontend (Vercel) - 10 minutes
1. [ ] Go to https://vercel.com
2. [ ] Sign up with GitHub
3. [ ] Click "Add New Project"
4. [ ] Import `doctor_appointment_system`
5. [ ] Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   ```
6. [ ] Click "Deploy"
7. [ ] Wait for deployment (~3 minutes)
8. [ ] Copy Vercel URL (e.g., `https://doctor-appointment-system.vercel.app`)

#### Final Configuration - 5 minutes
1. [ ] Update Railway CORS_ALLOWED_ORIGINS:
   ```
   CORS_ALLOWED_ORIGINS=https://doctor-appointment-system.vercel.app
   ```
2. [ ] Test the application:
   - [ ] Open Vercel URL
   - [ ] Register new account
   - [ ] Login
   - [ ] Browse doctors
   - [ ] Book appointment

### Option 2: Local Network Access (Testing) - 5 minutes

1. [ ] Find your local IP:
   ```bash
   ipconfig
   ```
   Look for IPv4 Address (e.g., 192.168.1.100)

2. [ ] Update backend/.env:
   ```
   ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.100
   CORS_ALLOWED_ORIGINS=http://192.168.1.100:3000,http://localhost:3000
   ```

3. [ ] Update frontend/.env.local:
   ```
   NEXT_PUBLIC_API_URL=http://192.168.1.100:8000/api
   ```

4. [ ] Start backend:
   ```bash
   cd backend
   python manage.py runserver 0.0.0.0:8000
   ```

5. [ ] Start frontend:
   ```bash
   cd frontend
   npm run dev -- -H 0.0.0.0
   ```

6. [ ] Access from other laptop:
   - Open: `http://192.168.1.100:3000`
   - Both devices must be on same WiFi

## 🔐 Security Checklist

- [ ] Generate new SECRET_KEY for production
- [ ] Set DEBUG=False in production
- [ ] Configure ALLOWED_HOSTS properly
- [ ] Set up CORS with specific origins (not *)
- [ ] Use HTTPS in production (automatic on Vercel/Railway)
- [ ] Enable database backups
- [ ] Set up monitoring/logging

## 🧪 Testing Checklist

After deployment, test:
- [ ] User registration
- [ ] User login
- [ ] Browse doctors
- [ ] Book appointment
- [ ] View dashboard
- [ ] Doctor panel (if doctor account)
- [ ] Payment flow
- [ ] Notifications
- [ ] Profile updates

## 📊 Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Monitor uptime (UptimeRobot)
- [ ] Check performance (Vercel Analytics)
- [ ] Review logs regularly

## 💰 Cost Estimate

### Free Tier (Good for testing/small projects)
- Vercel: Free (100GB bandwidth/month)
- Railway: $5 credit/month (~500 hours)
- **Total: $0-5/month**

### Production (Recommended)
- Vercel Pro: $20/month
- Railway: ~$5-10/month
- **Total: $25-30/month**

## 🆘 Troubleshooting

### Backend Issues
- **500 Error**: Check Railway logs
- **Database Error**: Verify PostgreSQL connection
- **CORS Error**: Update CORS_ALLOWED_ORIGINS
- **Static Files**: Run collectstatic

### Frontend Issues
- **API Connection Failed**: Check NEXT_PUBLIC_API_URL
- **Build Failed**: Review Vercel build logs
- **Environment Variables**: Verify in dashboard

### Common Fixes
1. Clear build cache and redeploy
2. Check all environment variables
3. Verify URLs use HTTPS in production
4. Review platform logs

## 📝 Notes

- Railway auto-deploys on git push
- Vercel auto-deploys on git push
- Both platforms provide free SSL certificates
- Database backups are automatic on Railway
- Logs are available in both dashboards

## 🎯 Success Criteria

Deployment is successful when:
- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can view doctors list
- [ ] Can book appointment
- [ ] All API calls work
- [ ] No CORS errors
- [ ] No 500 errors

## 📞 Support Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Django Deployment: https://docs.djangoproject.com/en/5.0/howto/deployment/
- Next.js Deployment: https://nextjs.org/docs/deployment

## 🚀 Quick Commands

### Generate Secret Key
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Test Backend Locally
```bash
cd backend
python manage.py runserver
```

### Test Frontend Locally
```bash
cd frontend
npm run dev
```

### Check Backend Health
```bash
curl https://your-backend.railway.app/api/schema/swagger-ui/
```

### Check Frontend Health
```bash
curl https://your-frontend.vercel.app
```

Good luck with your deployment! 🎉
