const { pool, parseJSON, stringifyJSON } = require('../utils/dbHelpers');
const User = require('./User');

class Challenge {
  static async create(challengeData) {
    const {
      title,
      description,
      type,
      duration,
      xpReward = 100,
      endDate
    } = challengeData;

    const [result] = await pool.query(
      `INSERT INTO challenges 
       (title, description, type, duration, xpReward, endDate, participants)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        type,
        duration,
        xpReward,
        new Date(endDate),
        stringifyJSON([])
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM challenges WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return null;
    const challenge = rows[0];
    challenge.participants = parseJSON(challenge.participants) || [];
    
    // Populate participant user info
    if (challenge.participants.length > 0) {
      const userIds = challenge.participants.map(p => p.userId);
      const users = await Promise.all(userIds.map(id => User.findById(id)));
      challenge.participants = challenge.participants.map(p => {
        const user = users.find(u => u && u.id === p.userId);
        return {
          ...p,
          userId: user ? {
            _id: user.id,
            name: user.name
          } : { _id: p.userId }
        };
      });
    }

    return challenge;
  }

  static async find(query = {}) {
    let sql = 'SELECT * FROM challenges WHERE 1=1';
    const params = [];

    if (query.isActive !== undefined) {
      sql += ' AND isActive = ?';
      params.push(query.isActive);
    }

    sql += ' ORDER BY createdAt DESC';

    const [rows] = await pool.query(sql, params);
    
    const challenges = await Promise.all(rows.map(async (row) => {
      const challenge = {
        _id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        duration: row.duration,
        xpReward: row.xpReward,
        startDate: row.startDate,
        endDate: row.endDate,
        isActive: row.isActive,
        createdAt: row.createdAt,
        participants: parseJSON(row.participants) || []
      };

      // Populate participant user info
      if (challenge.participants.length > 0) {
        const userIds = challenge.participants.map(p => p.userId);
        const users = await Promise.all(userIds.map(id => User.findById(id)));
        challenge.participants = challenge.participants.map(p => {
          const user = users.find(u => u && u.id === p.userId);
          return {
            ...p,
            userId: user ? {
              _id: user.id,
              name: user.name
            } : { _id: p.userId }
          };
        });
      }

      return challenge;
    }));

    return challenges;
  }

  static async updateById(id, updateData) {
    const fields = [];
    const values = [];

    if (updateData.participants !== undefined) {
      fields.push('participants = ?');
      values.push(stringifyJSON(updateData.participants));
    }

    if (fields.length === 0) return null;

    values.push(id);
    await pool.query(
      `UPDATE challenges SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async countDocuments(query = {}) {
    let sql = 'SELECT COUNT(*) as count FROM challenges WHERE 1=1';
    const params = [];

    if (query.isActive !== undefined) {
      sql += ' AND isActive = ?';
      params.push(query.isActive);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].count;
  }
}

module.exports = Challenge;
