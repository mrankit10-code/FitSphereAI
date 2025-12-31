# FitSphere AI - Smart Fitness for Real Life

A modern, AI-powered fitness website that provides personalized workouts, diet guidance, mental wellness, and progress tracking.

## Features

- 🤖 **AI Workout Generator** - Personalized workouts based on goals, fitness level, and available time
- 🍎 **Personalized Nutrition** - Customized nutrition plans with Indian meal suggestions
- 🧘 **Mental Wellness** - Guided breathing exercises and meditation routines
- 👥 **Community** - Connect with others, share progress, and participate in challenges
- 📊 **Progress Tracking** - Track weight, workouts, and achievements with visualizations
- 🏆 **Gamification** - Earn XP, maintain streaks, unlock badges, and compete on leaderboards
- 👨‍💼 **Admin Panel** - Manage users, challenges, and view platform analytics

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Recharts (for data visualization)
- React Icons

### Backend
- Node.js
- Express.js
- MySQL (with mysql2)
- JWT Authentication
- bcryptjs (password hashing)
- express-validator (input validation)
- express-rate-limit (rate limiting)

## Project Structure

```
fitsphere-ai/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # MySQL models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Helper utilities
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context (Auth)
│   │   ├── pages/       # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── package.json         # Root package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fitsphere-ai
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```
   Or install separately:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=fitsphere
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

4. **Set up MySQL Database**
   - Install MySQL on your system
   - Create a database: `CREATE DATABASE fitsphere;`
   - Update the `.env` file with your MySQL credentials
   - The database tables will be created automatically when you start the server
   
   For detailed MySQL setup instructions, see [MYSQL_SETUP.md](./MYSQL_SETUP.md)

5. **Run the application**
   
   **Option 1: Run both frontend and backend together**
   ```bash
   npm run dev
   ```
   
   **Option 2: Run separately**
   
   Terminal 1 (Backend):
   ```bash
   npm run server
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Create/update profile

### Workouts
- `POST /api/workouts/generate` - Generate AI workout
- `GET /api/workouts` - Get user workouts
- `PUT /api/workouts/:id/complete` - Mark workout as completed

### Nutrition
- `GET /api/nutrition/plan` - Get nutrition plan
- `GET /api/nutrition/today` - Get today's meal suggestions

### Progress
- `POST /api/progress` - Add progress entry
- `GET /api/progress` - Get progress history
- `GET /api/progress/stats` - Get progress statistics

### Community
- `POST /api/community/posts` - Create post
- `GET /api/community/posts` - Get all posts
- `PUT /api/community/posts/:id/like` - Like/unlike post
- `POST /api/community/posts/:id/comments` - Add comment
- `GET /api/community/leaderboard` - Get leaderboard

### Challenges
- `GET /api/challenges` - Get all challenges
- `POST /api/challenges/:id/join` - Join challenge
- `PUT /api/challenges/:id/progress` - Update challenge progress

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get platform statistics
- `POST /api/admin/challenges` - Create challenge
- `DELETE /api/admin/users/:id` - Delete user

## Database Schema

### Users
- name, email, password (hashed)
- role (user/admin)
- xp, streak, badges
- lastWorkoutDate

### Profiles
- userId, age, height, weight
- gender, fitnessGoal, fitnessLevel
- dailyWorkoutTime, equipmentAvailability
- foodPreference

### Workouts
- userId, title, exercises[]
- duration, caloriesBurned
- completed, workoutType, difficulty

### Progress
- userId, weight, bodyFat, muscleMass
- measurements (chest, waist, hips, arms, thighs)
- beforeImage, afterImage, notes

### Community Posts
- userId, text, images[]
- likes[], comments[]

### Challenges
- title, description, type
- duration, xpReward
- participants[], startDate, endDate

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation with express-validator
- Rate limiting on API routes
- Protected routes middleware
- Admin-only routes

## Future Enhancements

- AI fitness chatbot
- Wearable device integration
- Voice-guided workouts
- AR posture correction
- Subscription model
- Real-time notifications
- Video workout tutorials

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support, email support@fitsphere.ai or create an issue in the repository.

---

Built with ❤️ for fitness enthusiasts

