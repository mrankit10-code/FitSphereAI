# How to Run FitSphere AI - Complete Guide

This guide will help you run all pages perfectly.

## Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MySQL** - [Download](https://dev.mysql.com/downloads/mysql/) or use XAMPP/WAMP
3. **npm** (comes with Node.js)

## Step-by-Step Setup

### 1. Install MySQL

**Option A: Standalone MySQL**
- Download from [mysql.com](https://dev.mysql.com/downloads/mysql/)
- Install and set a root password
- Start MySQL service

**Option B: XAMPP (Easier for Windows)**
- Download [XAMPP](https://www.apachefriends.org/)
- Install and start MySQL from XAMPP Control Panel

### 2. Create Database

Open MySQL command line or phpMyAdmin and run:

```sql
CREATE DATABASE fitsphere;
```

### 3. Configure Environment

1. Navigate to `backend` folder
2. Create `.env` file (copy from `.env.example` if exists)
3. Add these values:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fitsphere
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:** Replace `your_mysql_password` with your actual MySQL password!

### 4. Install Dependencies

**From project root:**
```bash
npm run install-all
```

**Or install separately:**
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 5. Start the Application

**Option 1: Run Both Together (Recommended)**
```bash
# From project root
npm run dev
```

**Option 2: Run Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## Verification Steps

### Check Backend
1. Open http://localhost:5000/api/health
2. Should see: `{"status":"OK","message":"FitSphere AI API is running"}`

### Check Database Connection
Look for these messages in the backend console:
```
MySQL Connected
Database tables created/verified successfully
```

### Test Application
1. Open http://localhost:3000
2. Click "Sign Up"
3. Create an account
4. Complete profile setup
5. Navigate through all pages

## Troubleshooting

### MySQL Connection Error

**Error:** `MySQL connection error: Access denied`

**Solution:**
1. Check `.env` file has correct credentials
2. Verify MySQL is running
3. Test connection:
   ```bash
   mysql -u root -p
   ```

### Port Already in Use

**Error:** `Port 5000 already in use`

**Solution:**
1. Change PORT in `backend/.env`
2. Or kill the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill
   ```

### Frontend Won't Start

**Error:** `Cannot find module 'react-scripts'`

**Solution:**
```bash
cd frontend
npm install
```

### Database Tables Not Created

**Solution:**
1. Check MySQL connection in console
2. Verify database exists: `SHOW DATABASES;`
3. Check table creation logs in backend console
4. Manually run SQL from `backend/config/initDatabase.js` if needed

### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Backend CORS is already configured
- Make sure backend is running on port 5000
- Check `frontend/package.json` has `"proxy": "http://localhost:5000"`

## Pages Checklist

After setup, test these pages:

- [x] **Landing Page** - `/` - Should load with hero section
- [x] **Sign Up** - `/signup` - Create new account
- [x] **Login** - `/login` - Login with credentials
- [x] **Profile Setup** - `/profile-setup` - Complete your profile
- [x] **Dashboard** - `/dashboard` - View stats and quick actions
- [x] **Workouts** - `/workouts` - Generate and view workouts
- [x] **Nutrition** - `/nutrition` - View nutrition plan
- [x] **Wellness** - `/wellness` - Breathing exercises and meditation
- [x] **Progress** - `/progress` - Track your progress
- [x] **Community** - `/community` - View posts and leaderboard
- [x] **Admin** - `/admin` - Admin panel (admin users only)

## Common Issues

### Issue: "Please complete your profile first"

**Solution:** Go to `/profile-setup` and fill in all required fields

### Issue: "Invalid credentials" on login

**Solution:** 
- Verify email and password
- Check user exists in database
- Try creating a new account

### Issue: Frontend shows blank page

**Solution:**
1. Check browser console for errors
2. Verify backend is running
3. Check network tab for API calls
4. Clear browser cache

### Issue: API calls return 401 Unauthorized

**Solution:**
1. Make sure you're logged in
2. Check token in localStorage
3. Try logging out and back in

## Development Tips

1. **Hot Reload:** Both frontend and backend support hot reload
2. **Database Changes:** Tables are auto-created on server start
3. **Logs:** Check console for detailed error messages
4. **API Testing:** Use Postman or browser DevTools Network tab

## Production Deployment

For production:
1. Set `NODE_ENV=production` in `.env`
2. Use strong `JWT_SECRET`
3. Use production MySQL database
4. Build frontend: `cd frontend && npm run build`
5. Serve frontend build with a web server

## Need Help?

- Check `MYSQL_SETUP.md` for detailed MySQL setup
- Check `README.md` for general information
- Review console logs for specific errors

---

**You're all set!** 🎉 Start the servers and begin your fitness journey!

