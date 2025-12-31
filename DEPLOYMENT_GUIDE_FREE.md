# 🚀 FitSphereAI - Complete Free Deployment Guide

## Project Analysis

**Tech Stack:**
- Frontend: React 18, React Router, Axios, Recharts
- Backend: Node.js, Express.js, MySQL, JWT Auth
- Database: MySQL

**Architecture:** Full-stack MERN + MySQL application

---

## 🎯 FREE Deployment Options

### **Best Option: Recommended Stack**

| Component | Free Platform | Free Tier | Notes |
|-----------|---------------|-----------|-------|
| **Frontend** | Vercel / Netlify | ✅ Unlimited | Best for React apps |
| **Backend** | Render / Railway | ✅ Free tier available | Node.js with MySQL support |
| **Database** | PlanetScale | ✅ 5GB free | MySQL-compatible |

---

## 📋 Step-by-Step Deployment Guide

### **STEP 1: Prepare Your Project for Deployment**

#### 1.1 Update Frontend Configuration
Edit `frontend/package.json`:

```json
{
  "proxy": "https://your-backend-url.com"  // Remove localhost
}
```

#### 1.2 Create Environment Files

**`.env.production` in frontend root:**
```
REACT_APP_API_URL=https://your-backend-url.com
```

**Update `frontend/src/` API calls** to use:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

#### 1.3 Update Backend for Production

**`backend/.env` (update for production):**
```env
PORT=5000
DB_HOST=your-planetscale-host.mysql.com
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=fitsphere
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=production
```

#### 1.4 Add Vercel Configuration

Create `vercel.json` in root:
```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/build",
  "env": {
    "REACT_APP_API_URL": "@react_app_api_url"
  }
}
```

---

### **STEP 2: Set Up Free Database (PlanetScale)**

1. **Go to:** https://planetscale.com/
2. **Sign up** with GitHub (easiest)
3. **Create new database** called `fitsphere`
4. **Get connection details:**
   - Go to "Connections" → "Connect with" → "Node.js"
   - Copy the connection string

5. **Update backend/.env** with PlanetScale credentials

**Example connection string:**
```
DB_HOST=aws.connect.psdb.cloud
DB_USER=xxxxx
DB_PASSWORD=pscale_xxxxx
```

**Note:** PlanetScale has MySQL compatibility, but use this for connection:
```javascript
// In backend/config/database.js
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: 'amazon',  // ADD THIS for PlanetScale
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

---

### **STEP 3: Deploy Backend (Using Render.com)**

1. **Go to:** https://render.com/
2. **Sign up** with GitHub
3. **Create New → Web Service**
4. **Connect your GitHub repo** (https://github.com/mrankit10-code/FitSphereAI)
5. **Configuration:**
   - **Name:** fitsphere-api
   - **Branch:** main
   - **Runtime:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Instance Type:** Free

6. **Add Environment Variables:**
   - DB_HOST: (from PlanetScale)
   - DB_USER: (from PlanetScale)
   - DB_PASSWORD: (from PlanetScale)
   - DB_NAME: fitsphere
   - JWT_SECRET: (strong secret key)
   - NODE_ENV: production

7. **Click Deploy**

**Your backend URL will be:** `https://fitsphere-api.onrender.com`

---

### **STEP 4: Deploy Frontend (Using Vercel)**

1. **Go to:** https://vercel.com/
2. **Sign in** with GitHub
3. **Import Project** → Select your GitHub repo
4. **Configuration:**
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build` (in frontend folder)
   - **Output Directory:** `frontend/build`

5. **Environment Variables:**
   - `REACT_APP_API_URL=https://fitsphere-api.onrender.com`

6. **Click Deploy**

**Your frontend URL will be:** `https://fitsphere-ai.vercel.app`

---

### **STEP 5: Final Configuration Updates**

#### 5.1 Update CORS in Backend

Edit `backend/server.js`:
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://fitsphere-ai.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

#### 5.2 Update Frontend API Base URL

Edit `frontend/src/context/AuthContext.js` and other API files:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Use API_URL in all axios calls
axios.post(`${API_URL}/api/auth/signup`, userData)
```

---

## 🔧 Alternative: All-in-One Solutions

### **Option A: Railway.app (Simpler)**

1. Go to https://railway.app/
2. Connect GitHub repo
3. Add MySQL plugin (free tier)
4. Deploy in one click

**Pros:** Everything in one place, easiest setup
**Cons:** Limited free tier (500 hours/month)

### **Option B: Heroku Alternative (Koyeb)**

1. Go to https://www.koyeb.com/
2. Connect GitHub
3. Deploy with free tier

---

## 📊 Free Tier Limits Comparison

| Service | Free Limit | Cost After |
|---------|-----------|-----------|
| **Vercel** | Unlimited builds | $20/month |
| **Netlify** | 300 build minutes/month | $45/month |
| **Render** | 750 free hours/month | $7-12/month |
| **Railway** | $5 credit/month | Pay as you go |
| **PlanetScale** | 5GB storage | $29/month |

---

## ✅ Pre-Deployment Checklist

- [ ] Remove `.env` from git (add to .gitignore)
- [ ] Update all `localhost:5000` references
- [ ] Add production URLs to CORS whitelist
- [ ] Test login/signup locally
- [ ] Verify database migrations work
- [ ] Build frontend: `npm run build`
- [ ] Test build locally: `serve -s frontend/build`
- [ ] Commit all changes to GitHub
- [ ] Create `.env.example` for reference

---

## 🚨 Common Issues & Fixes

### **Issue 1: CORS Errors**
**Fix:** Update CORS origins in `backend/server.js`
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### **Issue 2: Database Connection Fails**
**Fix:** 
- Check PlanetScale SSL: `ssl: 'amazon'`
- Verify password doesn't have special chars (URL encode if needed)
- Whitelist IP in PlanetScale (allow all for free tier)

### **Issue 3: Frontend Blank Page**
**Fix:**
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set
- Rebuild and redeploy

### **Issue 4: Database Tables Not Created**
**Fix:** Run migration manually in PlanetScale console or check `initDatabase.js` runs on startup

---

## 📈 Scaling Plan (When Free Tier Not Enough)

1. **Frontend:** Upgrade to Vercel Pro ($20/month)
2. **Backend:** Upgrade Render ($7/month)
3. **Database:** Upgrade PlanetScale ($29/month)
4. **Total:** ~$55/month for production-ready app

---

## 🎓 Quick Commands for Deployment

```bash
# Build frontend for production
cd frontend && npm run build

# Test production build locally
npm install -g serve
serve -s frontend/build

# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Check Node version (should be 16+)
node --version

# Clear npm cache if issues
npm cache clean --force
```

---

## 📞 Quick Deployment Summary

**What to do now:**

1. **Database:** Create PlanetScale account & get connection string (5 min)
2. **Backend:** Deploy to Render with environment variables (10 min)
3. **Frontend:** Deploy to Vercel with API URL (5 min)
4. **Test:** Try signup/login on live URL (5 min)

**Total Time:** ~25 minutes

---

## 🌐 Final URLs (Examples)

- **Frontend:** https://fitsphere-ai.vercel.app
- **Backend API:** https://fitsphere-api.onrender.com
- **Database:** PlanetScale MySQL (cloud-hosted)

---

**Your app will be live and completely free! 🎉**

For help, check docs:
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- PlanetScale: https://planetscale.com/docs
