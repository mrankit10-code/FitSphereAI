const { pool, parseJSON, stringifyJSON } = require('../utils/dbHelpers');

class Workout {
  static async create(workoutData) {
    const {
      userId,
      title,
      exercises,
      duration,
      caloriesBurned = 0,
      workoutType = 'home',
      difficulty = 'beginner'
    } = workoutData;

    const [result] = await pool.query(
      `INSERT INTO workouts 
       (userId, title, exercises, duration, caloriesBurned, workoutType, difficulty)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title,
        stringifyJSON(exercises),
        duration,
        caloriesBurned,
        workoutType,
        difficulty
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM workouts WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return null;
    const workout = rows[0];
    workout.exercises = parseJSON(workout.exercises) || [];
    return workout;
  }

  static async find(query = {}) {
    let sql = 'SELECT * FROM workouts WHERE 1=1';
    const params = [];

    if (query.userId) {
      sql += ' AND userId = ?';
      params.push(query.userId);
    }

    if (query.completed !== undefined) {
      sql += ' AND completed = ?';
      params.push(query.completed);
    }

    sql += ' ORDER BY createdAt DESC';

    if (query.limit) {
      sql += ' LIMIT ?';
      params.push(query.limit);
    }

    const [rows] = await pool.query(sql, params);
    return rows.map(workout => ({
      ...workout,
      exercises: parseJSON(workout.exercises) || []
    }));
  }

  static async findOne(query) {
    if (query._id || query.id) {
      return this.findById(query._id || query.id);
    }
    if (query.userId && query.id) {
      const [rows] = await pool.query(
        'SELECT * FROM workouts WHERE userId = ? AND id = ?',
        [query.userId, query.id]
      );
      if (rows.length === 0) return null;
      const workout = rows[0];
      workout.exercises = parseJSON(workout.exercises) || [];
      return workout;
    }
    return null;
  }

  static async updateById(id, updateData) {
    const fields = [];
    const values = [];

    if (updateData.completed !== undefined) {
      fields.push('completed = ?');
      values.push(updateData.completed);
    }
    if (updateData.completedAt !== undefined) {
      fields.push('completedAt = ?');
      values.push(updateData.completedAt);
    }

    if (fields.length === 0) return null;

    values.push(id);
    await pool.query(
      `UPDATE workouts SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async countDocuments(query = {}) {
    let sql = 'SELECT COUNT(*) as count FROM workouts WHERE 1=1';
    const params = [];

    if (query.completed !== undefined) {
      sql += ' AND completed = ?';
      params.push(query.completed);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].count;
  }
}

module.exports = Workout;
