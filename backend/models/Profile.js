const { pool, parseJSON, stringifyJSON } = require('../utils/dbHelpers');

class Profile {
  static async findOne(query) {
    let sql = 'SELECT * FROM profiles WHERE ';
    const params = [];
    
    if (query.userId) {
      sql += 'userId = ?';
      params.push(query.userId);
    } else if (query.id) {
      sql += 'id = ?';
      params.push(query.id);
    } else {
      return null;
    }
    
    const [rows] = await pool.query(sql, params);
    
    if (rows.length === 0) return null;
    const profile = rows[0];
    profile.equipmentAvailability = parseJSON(profile.equipmentAvailability) || ['bodyweight'];
    return profile;
  }

  static async create(profileData) {
    const {
      userId,
      age,
      height,
      weight,
      gender = 'prefer-not-to-say',
      fitnessGoal = 'general-fitness',
      dailyWorkoutTime = 30,
      equipmentAvailability = ['bodyweight'],
      foodPreference = 'no-preference',
      fitnessLevel = 'beginner'
    } = profileData;

    const [result] = await pool.query(
      `INSERT INTO profiles 
       (userId, age, height, weight, gender, fitnessGoal, dailyWorkoutTime, equipmentAvailability, foodPreference, fitnessLevel)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        age,
        height,
        weight,
        gender,
        fitnessGoal,
        dailyWorkoutTime,
        stringifyJSON(equipmentAvailability),
        foodPreference,
        fitnessLevel
      ]
    );

    return this.findOne({ id: result.insertId });
  }

  static async update(userId, updateData) {
    const fields = [];
    const values = [];
    
    const allowedFields = ['age', 'height', 'weight', 'gender', 'fitnessGoal', 'dailyWorkoutTime', 'foodPreference', 'fitnessLevel'];
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(updateData[field]);
      }
    });
    
    if (updateData.equipmentAvailability !== undefined) {
      fields.push('equipmentAvailability = ?');
      values.push(stringifyJSON(updateData.equipmentAvailability));
    }
    
    if (fields.length === 0) {
      return this.findOne({ userId });
    }
    
    values.push(userId);
    
    await pool.query(
      `UPDATE profiles SET ${fields.join(', ')} WHERE userId = ?`,
      values
    );
    
    return this.findOne({ userId });
  }

  static async findOneAndUpdate(query, updateData) {
    const existing = await this.findOne(query);
    
    if (existing) {
      return this.update(existing.userId, updateData);
    } else {
      return this.create({ ...query, ...updateData });
    }
  }
}

module.exports = Profile;
