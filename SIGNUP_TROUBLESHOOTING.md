# Signup Failed - Troubleshooting Guide

## 🔍 Common Causes & Solutions

### 1. **Backend Not Running**
**Symptom:** Network error, connection refused

**Solution:**
```bash
# Check if backend is running
cd backend
npm run dev

# Should see:
# Server running on port 5000
# MySQL Connected
```

### 2. **MySQL Connection Error**
**Symptom:** "Server error during signup" in console

**Check:**
- MySQL is running
- `.env` file has correct credentials
- Database exists: `CREATE DATABASE fitsphere;`

**Test connection:**
```bash
mysql -u root -p
USE fitsphere;
SHOW TABLES;
```

### 3. **Database Tables Not Created**
**Symptom:** "Table 'users' doesn't exist" error

**Solution:**
- Restart backend server
- Tables auto-create on server start
- Check console for: "Database tables created/verified successfully"

### 4. **Missing Environment Variables**
**Symptom:** Connection errors

**Check `backend/.env`:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fitsphere
JWT_SECRET=your_secret_key
```

### 5. **Email Already Exists**
**Symptom:** "User already exists with this email"

**Solution:**
- Use a different email
- Or delete existing user from database

### 6. **Validation Errors**
**Symptom:** Form validation fails

**Check:**
- Name is not empty
- Email is valid format
- Password is at least 6 characters
- Passwords match (if confirm password field)

### 7. **CORS Issues**
**Symptom:** CORS error in browser console

**Solution:**
- Check `frontend/package.json` has: `"proxy": "http://localhost:5000"`
- Backend CORS is already configured
- Make sure backend is on port 5000

### 8. **Frontend-Backend Connection**
**Symptom:** API calls fail

**Check:**
- Backend running on http://localhost:5000
- Frontend running on http://localhost:3000
- Test: http://localhost:5000/api/health

## 🛠️ Step-by-Step Debugging

### Step 1: Check Backend Console
Look for errors when you try to sign up:
```
Signup error: [error details]
```

### Step 2: Check Browser Console
Open DevTools (F12) → Console tab
Look for:
- Network errors
- CORS errors
- API errors

### Step 3: Check Network Tab
Open DevTools → Network tab
- Find the `/api/auth/signup` request
- Check Status code (should be 201)
- Check Response for error message

### Step 4: Test Backend Directly
```bash
# Test signup endpoint
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

## 🔧 Quick Fixes

### Fix 1: Restart Everything
```bash
# Stop all servers (Ctrl+C)
# Then restart:
npm run dev
```

### Fix 2: Check Database
```sql
-- Connect to MySQL
mysql -u root -p

-- Check database exists
SHOW DATABASES;

-- Use database
USE fitsphere;

-- Check tables exist
SHOW TABLES;

-- Should see: users, profiles, workouts, etc.
```

### Fix 3: Recreate Tables
If tables are missing:
1. Stop backend
2. Delete database: `DROP DATABASE fitsphere;`
3. Create new: `CREATE DATABASE fitsphere;`
4. Start backend (tables auto-create)

### Fix 4: Check Error Messages
Look at the exact error message:
- **"User already exists"** → Use different email
- **"Server error"** → Check backend console
- **"Network error"** → Backend not running
- **"Table doesn't exist"** → Restart backend

## 📝 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Server error during signup" | Database issue | Check MySQL connection |
| "User already exists" | Email taken | Use different email |
| "Network Error" | Backend down | Start backend server |
| "CORS error" | Proxy issue | Check package.json proxy |
| "Table 'users' doesn't exist" | Tables not created | Restart backend |

## ✅ Verification Checklist

- [ ] Backend server is running
- [ ] MySQL is running
- [ ] Database `fitsphere` exists
- [ ] `.env` file is configured
- [ ] Tables are created (check console)
- [ ] Frontend can reach backend (test /api/health)
- [ ] No CORS errors in browser
- [ ] Email is not already registered

## 🎯 Still Not Working?

1. **Check backend console** for detailed error
2. **Check browser console** for frontend errors
3. **Check Network tab** for API response
4. **Verify MySQL connection** manually
5. **Try creating user directly in database** to test

## 💡 Pro Tip

Enable detailed logging:
```javascript
// In backend/routes/auth.js, add:
console.log('Signup attempt:', { name, email });
console.log('Database result:', result);
```

This will help identify exactly where it's failing.

