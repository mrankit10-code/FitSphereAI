const { pool, parseJSON, stringifyJSON } = require('../utils/dbHelpers');
const User = require('./User');

class CommunityPost {
  static async create(postData) {
    const { userId, text, images = [] } = postData;

    const [result] = await pool.query(
      `INSERT INTO community_posts (userId, text, images, likes)
       VALUES (?, ?, ?, ?)`,
      [
        userId,
        text.trim(),
        stringifyJSON(images),
        stringifyJSON([])
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM community_posts WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return null;
    const post = rows[0];
    post.images = parseJSON(post.images) || [];
    post.likes = parseJSON(post.likes) || [];
    
    // Get comments
    const [comments] = await pool.query(
      'SELECT c.*, u.name, u.email FROM comments c LEFT JOIN users u ON c.userId = u.id WHERE c.postId = ? ORDER BY c.createdAt ASC',
      [id]
    );
    post.comments = comments.map(comment => ({
      _id: comment.id,
      userId: {
        _id: comment.userId,
        name: comment.name,
        email: comment.email
      },
      text: comment.text,
      createdAt: comment.createdAt
    }));

    // Get user info
    const user = await User.findById(post.userId);
    post.userId = {
      _id: user.id,
      name: user.name,
      email: user.email
    };

    return post;
  }

  static async find(query = {}) {
    let sql = `SELECT p.*, u.name, u.email 
               FROM community_posts p 
               LEFT JOIN users u ON p.userId = u.id 
               WHERE 1=1`;
    const params = [];

    sql += ' ORDER BY p.createdAt DESC';

    if (query.limit) {
      sql += ' LIMIT ?';
      params.push(query.limit);
    }

    const [rows] = await pool.query(sql, params);
    
    const posts = await Promise.all(rows.map(async (row) => {
      const post = {
        _id: row.id,
        userId: {
          _id: row.userId,
          name: row.name,
          email: row.email
        },
        text: row.text,
        images: parseJSON(row.images) || [],
        likes: parseJSON(row.likes) || [],
        createdAt: row.createdAt
      };

      // Get comments
      const [comments] = await pool.query(
        'SELECT c.*, u.name, u.email FROM comments c LEFT JOIN users u ON c.userId = u.id WHERE c.postId = ? ORDER BY c.createdAt ASC',
        [row.id]
      );
      post.comments = comments.map(comment => ({
        _id: comment.id,
        userId: {
          _id: comment.userId,
          name: comment.name,
          email: comment.email
        },
        text: comment.text,
        createdAt: comment.createdAt
      }));

      return post;
    }));

    return posts;
  }

  static async updateById(id, updateData) {
    const fields = [];
    const values = [];

    if (updateData.likes !== undefined) {
      fields.push('likes = ?');
      values.push(stringifyJSON(updateData.likes));
    }

    if (fields.length === 0) return null;

    values.push(id);
    await pool.query(
      `UPDATE community_posts SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }
}

module.exports = CommunityPost;
