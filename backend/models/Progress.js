const { pool, parseJSON, stringifyJSON } = require('../utils/dbHelpers');

class Progress {
  static async create(progressData) {
    const {
      userId,
      weight,
      bodyFat,
      muscleMass,
      measurements,
      notes,
      beforeImage,
      afterImage
    } = progressData;

    const [result] = await pool.query(
      `INSERT INTO progress 
       (userId, weight, bodyFat, muscleMass, measurements, notes, beforeImage, afterImage)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        weight,
        bodyFat,
        muscleMass,
        stringifyJSON(measurements),
        notes,
        beforeImage,
        afterImage
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM progress WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return null;
    const progress = rows[0];
    progress.measurements = parseJSON(progress.measurements) || {};
    return progress;
  }

  static async find(query = {}) {
    let sql = 'SELECT * FROM progress WHERE 1=1';
    const params = [];

    if (query.userId) {
      sql += ' AND userId = ?';
      params.push(query.userId);
    }

    sql += ' ORDER BY date DESC';

    if (query.limit) {
      sql += ' LIMIT ?';
      params.push(query.limit);
    }

    const [rows] = await pool.query(sql, params);
    return rows.map(progress => ({
      ...progress,
      measurements: parseJSON(progress.measurements) || {}
    }));
  }
}

module.exports = Progress;
