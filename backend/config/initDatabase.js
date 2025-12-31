const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// SQL schema creation
const createTables = async () => {
  try {
    // First, create a connection to MySQL without specifying database
    const initialConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    // Create database if it doesn't exist
    await initialConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'fitsphere'}`);
    await initialConnection.end();

    // Now get connection from pool
    const pool = require('./database');
    const connection = await pool.getConnection();
    
    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        xp INT DEFAULT 0,
        streak INT DEFAULT 0,
        lastWorkoutDate DATE,
        badges JSON,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Profiles table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT UNIQUE NOT NULL,
        age INT,
        height DECIMAL(5,2),
        weight DECIMAL(5,2),
        gender ENUM('male', 'female', 'other', 'prefer-not-to-say') DEFAULT 'prefer-not-to-say',
        fitnessGoal ENUM('weight-loss', 'muscle-gain', 'endurance', 'flexibility', 'general-fitness') DEFAULT 'general-fitness',
        dailyWorkoutTime INT DEFAULT 30,
        equipmentAvailability JSON,
        foodPreference ENUM('vegetarian', 'non-vegetarian', 'vegan', 'no-preference') DEFAULT 'no-preference',
        fitnessLevel ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_userId (userId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Workouts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS workouts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        exercises JSON NOT NULL,
        duration INT NOT NULL,
        caloriesBurned INT DEFAULT 0,
        completed BOOLEAN DEFAULT FALSE,
        completedAt TIMESTAMP NULL,
        workoutType ENUM('home', 'gym', 'outdoor') DEFAULT 'home',
        difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_userId (userId),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Progress table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        weight DECIMAL(5,2),
        bodyFat DECIMAL(5,2),
        muscleMass DECIMAL(5,2),
        measurements JSON,
        beforeImage VARCHAR(500),
        afterImage VARCHAR(500),
        notes TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_userId (userId),
        INDEX idx_date (date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Community posts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS community_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        text TEXT NOT NULL,
        images JSON,
        likes JSON,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_userId (userId),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Comments table (separate from posts for better structure)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        postId INT NOT NULL,
        userId INT NOT NULL,
        text TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (postId) REFERENCES community_posts(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_postId (postId),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Challenges table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS challenges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type ENUM('streak', 'workout', 'nutrition', 'community') NOT NULL,
        duration INT NOT NULL,
        xpReward INT DEFAULT 100,
        participants JSON,
        startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        endDate TIMESTAMP NOT NULL,
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_isActive (isActive),
        INDEX idx_endDate (endDate)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    connection.release();
    console.log('Database tables created/verified successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

module.exports = createTables;

