# MySQL Database Setup Guide

This guide will help you set up MySQL database for FitSphere AI.

## Prerequisites

1. **Install MySQL**
   - Download and install MySQL from [mysql.com](https://dev.mysql.com/downloads/mysql/)
   - Or use MySQL via XAMPP/WAMP/MAMP
   - Or use a cloud MySQL service (AWS RDS, Google Cloud SQL, etc.)

2. **Create Database**
   ```sql
   CREATE DATABASE fitsphere;
   ```

## Configuration

### 1. Update Environment Variables

Create or update `backend/.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fitsphere
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

This will install `mysql2` package which is required for MySQL connection.

### 3. Database Tables

The database tables will be automatically created when you start the server. The `initDatabase.js` file will create all necessary tables:

- `users` - User accounts
- `profiles` - User profiles
- `workouts` - Workout records
- `progress` - Progress tracking
- `community_posts` - Community posts
- `comments` - Post comments
- `challenges` - Challenges

### 4. Start the Server

```bash
npm run dev
```

The server will:
1. Connect to MySQL database
2. Create all necessary tables automatically
3. Start listening on port 5000

## Manual Table Creation (Optional)

If you prefer to create tables manually, you can run the SQL scripts from `backend/config/initDatabase.js` in your MySQL client.

## Connection String Format

For different MySQL setups:

**Local MySQL:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fitsphere
```

**Remote MySQL:**
```env
DB_HOST=your-server-ip
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=fitsphere
```

**Cloud MySQL (e.g., AWS RDS):**
```env
DB_HOST=your-rds-endpoint.amazonaws.com
DB_USER=admin
DB_PASSWORD=your_password
DB_NAME=fitsphere
```

## Troubleshooting

### Connection Error
- Verify MySQL is running: `mysql -u root -p`
- Check credentials in `.env` file
- Ensure database exists: `CREATE DATABASE fitsphere;`
- Check firewall settings if connecting remotely

### Permission Error
- Grant privileges to your user:
  ```sql
  GRANT ALL PRIVILEGES ON fitsphere.* TO 'your_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

### Port Issues
- Default MySQL port is 3306
- If using different port, add to connection:
  ```javascript
  // In backend/config/database.js
  port: process.env.DB_PORT || 3306
  ```

## Migration from MongoDB

If you were previously using MongoDB:
1. Export your data (if needed)
2. Update `.env` with MySQL credentials
3. Restart the server - tables will be created automatically
4. Re-import data if necessary

## Testing Connection

You can test the connection by checking the server logs. You should see:
```
MySQL Connected
Database tables created/verified successfully
```

## Next Steps

After successful setup:
1. Start the backend server
2. Start the frontend server
3. Create a new user account
4. Complete your profile
5. Start using FitSphere AI!

