# Quick Fix: Signup Failed

## 🔥 Most Common Issues (90% of cases)

### Issue 1: Backend Not Running
**Quick Check:**
```bash
# Open new terminal
curl http://localhost:5000/api/health
```

**If error:** Start backend:
```bash
cd backend
npm run dev
```

### Issue 2: MySQL Not Running
**Quick Check:**
```bash
mysql -u root -p
```

**If error:** Start MySQL service

### Issue 3: Database Doesn't Exist
**Quick Fix:**
```sql
CREATE DATABASE fitsphere;
```

### Issue 4: Wrong .env Configuration
**Check `backend/.env`:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=fitsphere
```

## 🚀 30-Second Fix

1. **Check backend console** - Look for error messages
2. **Check browser console** (F12) - Look for network errors
3. **Verify MySQL:**
   ```bash
   mysql -u root -p
   USE fitsphere;
   SHOW TABLES;
   ```
4. **Restart everything:**
   ```bash
   # Stop servers (Ctrl+C)
   npm run dev
   ```

## 📋 What Error Are You Seeing?

### "Network Error" or "Connection Refused"
→ **Backend not running**
- Start: `cd backend && npm run dev`

### "Server error during signup"
→ **Database issue**
- Check MySQL is running
- Check `.env` file
- Check backend console for details

### "User already exists"
→ **Email taken**
- Use different email
- Or delete user from database

### "Table 'users' doesn't exist"
→ **Tables not created**
- Restart backend server
- Check console for "Database tables created"

### No Error, But Nothing Happens
→ **Check browser console**
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

## 🔍 Debug Steps

### Step 1: Test Backend
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"OK",...}`

### Step 2: Test Database
```bash
mysql -u root -p
USE fitsphere;
SELECT COUNT(*) FROM users;
```

### Step 3: Check Backend Logs
When you try to sign up, backend console should show:
- No errors = Good
- Error message = Tells you the problem

### Step 4: Check Browser Network
1. Open DevTools (F12)
2. Go to Network tab
3. Try to sign up
4. Find `/api/auth/signup` request
5. Check Status and Response

## ✅ Most Likely Solution

**90% of the time, it's one of these:**

1. **Backend not running** → Start it
2. **MySQL not running** → Start MySQL service
3. **Wrong password in .env** → Fix `.env` file
4. **Database doesn't exist** → Create it

## 💡 Still Stuck?

**Share these details:**
1. What error message do you see? (exact text)
2. Backend console output (when you try to sign up)
3. Browser console errors (F12 → Console)
4. Network tab response (F12 → Network → signup request)

This will help identify the exact issue!

