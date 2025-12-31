const bcrypt = require('bcryptjs');
const { pool, parseJSON } = require('../utils/dbHelpers');

class User {
  static async create(userData) {
    const { name, email, password, role = 'user' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const badges = JSON.stringify([]);
    
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, badges) VALUES (?, ?, ?, ?, ?)',
      [name, email.toLowerCase().trim(), hashedPassword, role, badges]
    );
    
    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) return null;
    const user = rows[0];
    user.badges = parseJSON(user.badges) || [];
    return user;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );
    
    if (rows.length === 0) return null;
    const user = rows[0];
    user.badges = parseJSON(user.badges) || [];
    return user;
  }

  static async findOne(query) {
    if (query._id || query.id) {
      return this.findById(query._id || query.id);
    }
    if (query.email) {
      return this.findByEmail(query.email);
    }
    return null;
  }

  static async find(query = {}) {
    let sql = 'SELECT * FROM users WHERE 1=1';
    const params = [];
    
    if (query.role) {
      sql += ' AND role = ?';
      params.push(query.role);
    }
    
    sql += ' ORDER BY createdAt DESC';
    
    if (query.limit) {
      sql += ' LIMIT ?';
      params.push(query.limit);
    }
    
    const [rows] = await pool.query(sql, params);
    return rows.map(user => ({
      ...user,
      badges: parseJSON(user.badges) || []
    }));
  }

  static async countDocuments(query = {}) {
    let sql = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
    const params = [];
    
    if (query.role) {
      sql += ' AND role = ?';
      params.push(query.role);
    }
    
    const [rows] = await pool.query(sql, params);
    return rows[0].count;
  }

  static async updateById(id, updateData) {
    const fields = [];
    const values = [];
    
    if (updateData.xp !== undefined) {
      fields.push('xp = ?');
      values.push(updateData.xp);
    }
    if (updateData.streak !== undefined) {
      fields.push('streak = ?');
      values.push(updateData.streak);
    }
    if (updateData.lastWorkoutDate !== undefined) {
      fields.push('lastWorkoutDate = ?');
      values.push(updateData.lastWorkoutDate);
    }
    if (updateData.badges !== undefined) {
      fields.push('badges = ?');
      values.push(JSON.stringify(updateData.badges));
    }
    
    if (fields.length === 0) return null;
    
    values.push(id);
    await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  static async deleteById(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Instance method for password comparison
  static async comparePassword(hashedPassword, candidatePassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;
