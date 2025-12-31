const { pool } = require('../utils/dbHelpers');

class Comment {
  static async create(commentData) {
    const { postId, userId, text } = commentData;

    const [result] = await pool.query(
      'INSERT INTO comments (postId, userId, text) VALUES (?, ?, ?)',
      [postId, userId, text.trim()]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT c.*, u.name, u.email 
       FROM comments c 
       LEFT JOIN users u ON c.userId = u.id 
       WHERE c.id = ?`,
      [id]
    );

    if (rows.length === 0) return null;
    const comment = rows[0];
    return {
      _id: comment.id,
      userId: {
        _id: comment.userId,
        name: comment.name,
        email: comment.email
      },
      text: comment.text,
      createdAt: comment.createdAt
    };
  }

  static async findByPostId(postId) {
    const [rows] = await pool.query(
      `SELECT c.*, u.name, u.email 
       FROM comments c 
       LEFT JOIN users u ON c.userId = u.id 
       WHERE c.postId = ? 
       ORDER BY c.createdAt ASC`,
      [postId]
    );

    return rows.map(comment => ({
      _id: comment.id,
      userId: {
        _id: comment.userId,
        name: comment.name,
        email: comment.email
      },
      text: comment.text,
      createdAt: comment.createdAt
    }));
  }
}

module.exports = Comment;

