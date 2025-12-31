# Quick Start Guide - Run All Pages Perfectly

## 🚀 Fast Setup (5 Minutes)

### 1. Install MySQL
- Download: https://dev.mysql.com/downloads/mysql/
- Or use XAMPP: https://www.apachefriends.org/

### 2. Create Database
```sql
CREATE DATABASE fitsphere;
```

### 3. Configure Backend
Create `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fitsphere
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 4. Install & Run
```bash
# Install all dependencies
npm run install-all

# Start both servers
npm run dev
```

### 5. Open Browser
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## ✅ What's Working

All pages are now fully functional with MySQL:

- ✅ **Landing Page** - Hero, features, testimonials
- ✅ **Authentication** - Sign up, login, JWT tokens
- ✅ **Profile Setup** - User onboarding
- ✅ **Dashboard** - Stats, badges, quick actions
- ✅ **Workout Generator** - AI-powered workouts
- ✅ **Nutrition** - Meal plans, calorie tracking
- ✅ **Mental Wellness** - Breathing, meditation
- ✅ **Progress Tracking** - Charts, history
- ✅ **Community** - Posts, likes, comments, leaderboard
- ✅ **Admin Panel** - User management, stats

## 🎯 Test Flow

1. **Sign Up** → Create account
2. **Profile Setup** → Fill in details
3. **Dashboard** → See your stats
4. **Generate Workout** → Get AI workout
5. **Complete Workout** → Earn XP and streak
6. **View Nutrition** → See meal plan
7. **Track Progress** → Add weight entry
8. **Community** → Post and interact
9. **Admin** → Manage (if admin user)

## 🔧 Troubleshooting

**MySQL not connecting?**
- Check `.env` file credentials
- Verify MySQL is running
- Test: `mysql -u root -p`

**Port already in use?**
- Change PORT in `.env`
- Or kill process: `lsof -ti:5000 | xargs kill`

**Frontend blank?**
- Check backend is running
- Clear browser cache
- Check console for errors

## 📝 Notes

- Tables are **auto-created** on server start
- All models converted to **MySQL**
- All routes updated to use **MySQL models**
- Frontend works **as-is** (no changes needed)

## 🎉 You're Ready!

Everything is set up and ready to run. Just follow the 5 steps above!

For detailed setup, see `HOW_TO_RUN.md`

