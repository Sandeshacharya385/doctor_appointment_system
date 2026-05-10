# Quick Setup for Local Network Access

## Step 1: Find Your IP Address

Open Command Prompt or PowerShell and run:
```bash
ipconfig
```

Look for "IPv4 Address" under your active network adapter (WiFi or Ethernet).
Example: `192.168.1.100`

**Write down your IP address**: _________________

## Step 2: Update Backend Configuration

1. Open `backend/.env` file
2. Find these lines and update them:

```env
ALLOWED_HOSTS=localhost,127.0.0.1,YOUR_IP_HERE
CORS_ALLOWED_ORIGINS=http://YOUR_IP_HERE:3000,http://localhost:3000
```

Replace `YOUR_IP_HERE` with your actual IP address from Step 1.

**Example**:
```env
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.100
CORS_ALLOWED_ORIGINS=http://192.168.1.100:3000,http://localhost:3000
```

## Step 3: Update Frontend Configuration

1. Open `frontend/.env.local` file
2. Find this line and update it:

```env
NEXT_PUBLIC_API_URL=http://YOUR_IP_HERE:8000/api
```

Replace `YOUR_IP_HERE` with your actual IP address from Step 1.

**Example**:
```env
NEXT_PUBLIC_API_URL=http://192.168.1.100:8000/api
```

## Step 4: Start Backend Server

Open a terminal/command prompt:

```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

**Keep this terminal open!**

You should see:
```
Starting development server at http://0.0.0.0:8000/
```

## Step 5: Start Frontend Server

Open a **NEW** terminal/command prompt:

```bash
cd frontend
npm run dev -- -H 0.0.0.0
```

**Keep this terminal open too!**

You should see:
```
- Local:        http://localhost:3000
- Network:      http://YOUR_IP:3000
```

## Step 6: Access from Other Laptop

On your other laptop (must be on the same WiFi network):

1. Open a web browser
2. Go to: `http://YOUR_IP_HERE:3000`
   - Replace `YOUR_IP_HERE` with your IP from Step 1
   - Example: `http://192.168.1.100:3000`

## ✅ Success!

You should now see your Doctor Appointment System running!

## 🔧 Troubleshooting

### Problem: Can't access from other laptop

**Solution 1: Check Firewall**
Windows Firewall might be blocking the connection.

1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Make sure Python and Node.js are allowed on Private networks

**Solution 2: Verify Same WiFi**
- Both laptops must be connected to the SAME WiFi network
- Check WiFi name on both devices

**Solution 3: Verify IP Address**
- Run `ipconfig` again to confirm your IP hasn't changed
- Update .env files if IP changed

### Problem: Backend not starting

**Error**: "Address already in use"
```bash
# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

### Problem: Frontend not starting

**Error**: "Port 3000 is already in use"
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Problem: CORS errors in browser console

**Solution**: Double-check that:
1. Backend `.env` has correct IP in `CORS_ALLOWED_ORIGINS`
2. Frontend `.env.local` has correct IP in `NEXT_PUBLIC_API_URL`
3. Both servers are running
4. Restart both servers after changing .env files

## 📝 Quick Reference

**Your IP Address**: _________________

**Backend URL**: `http://YOUR_IP:8000`

**Frontend URL**: `http://YOUR_IP:3000`

**API URL**: `http://YOUR_IP:8000/api`

## 🛑 When You're Done

To stop the servers:
1. Go to each terminal
2. Press `Ctrl + C`

## 💡 Tips

- Keep both terminals open while using the app
- If your IP changes (after restart), update the .env files again
- This setup only works on your local network (same WiFi)
- For internet access, use cloud deployment (see DEPLOYMENT_GUIDE.md)

## ⏱️ Total Time: ~5 minutes

1. Find IP: 1 minute
2. Update files: 2 minutes
3. Start servers: 2 minutes

That's it! Enjoy your deployed application! 🎉
