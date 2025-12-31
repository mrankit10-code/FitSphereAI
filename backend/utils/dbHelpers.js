const pool = require('../config/database');

// Helper function to parse JSON fields
const parseJSON = (value) => {
  if (!value) return null;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  return value;
};

// Helper function to stringify JSON fields
const stringifyJSON = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value;
};

module.exports = {
  pool,
  parseJSON,
  stringifyJSON
};

