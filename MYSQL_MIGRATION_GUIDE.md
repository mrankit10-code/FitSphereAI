# MySQL Migration Guide - Remaining Models

This document outlines how to convert the remaining Mongoose models to MySQL. The User and Profile models have already been converted.

## Pattern to Follow

All models should follow this pattern:

```javascript
const { pool, parseJSON, stringifyJSON } = require('../utils/dbHelpers');

class ModelName {
  static async create(data) {
    // Insert into database
  }

  static async findById(id) {
    // Find by ID
  }

  static async findOne(query) {
    // Find one record
  }

  static async find(query) {
    // Find multiple records
  }

  static async updateById(id, updateData) {
    // Update record
  }

  static async deleteById(id) {
    // Delete record
  }
}

module.exports = ModelName;
```

## Key Changes from Mongoose to MySQL

1. **Model Definition**: Use class with static methods instead of Mongoose schema
2. **Queries**: Use SQL queries with `pool.execute()` instead of Mongoose methods
3. **JSON Fields**: Use `JSON.stringify()` and `JSON.parse()` for JSON columns
4. **IDs**: Use `id` instead of `_id` (MySQL uses `id` as primary key)
5. **Relations**: Use JOIN queries or separate queries instead of `.populate()`

## Models to Convert

### 1. Workout Model
- Convert `exercises` array to JSON column
- Update all routes to use `userId` instead of `req.user._id`
- Change `_id` to `id` in responses

### 2. Progress Model
- Convert `measurements` object to JSON column
- Update date handling (MySQL uses TIMESTAMP)

### 3. CommunityPost Model
- Convert `images` and `likes` arrays to JSON columns
- Create separate `comments` table (already done in initDatabase.js)
- Use JOIN queries to get comments with posts

### 4. Challenge Model
- Convert `participants` array to JSON column
- Update date comparisons

## Route Updates Needed

All routes need these changes:

1. **User ID references**: Change `req.user._id` to `req.user.id`
2. **Model instantiation**: Change `new Model()` to `Model.create()`
3. **Model methods**: Change `.save()` to `Model.updateById()` or `Model.create()`
4. **Find queries**: Change `Model.findById()` to `Model.findById()` (already updated)
5. **Populate**: Replace `.populate()` with JOIN queries or separate queries

## Example: Workout Route Conversion

**Before (Mongoose):**
```javascript
const workout = new Workout({
  userId: req.user._id,
  title: '...',
  exercises: [...]
});
await workout.save();
```

**After (MySQL):**
```javascript
const workout = await Workout.create({
  userId: req.user.id,
  title: '...',
  exercises: [...]
});
```

## Example: Community Post with Comments

**Before (Mongoose):**
```javascript
const post = await CommunityPost.findById(id).populate('comments.userId');
```

**After (MySQL):**
```javascript
const post = await CommunityPost.findById(id);
const comments = await Comment.findByPostId(id);
post.comments = comments;
```

## Quick Reference

| Mongoose | MySQL |
|----------|-------|
| `new Model()` | `Model.create()` |
| `model.save()` | `Model.create()` or `Model.updateById()` |
| `Model.findById()` | `Model.findById()` |
| `Model.findOne()` | `Model.findOne()` |
| `Model.find()` | `Model.find()` |
| `model._id` | `model.id` |
| `model.populate()` | JOIN query or separate query |
| Array fields | JSON column with stringify/parse |

## Testing

After converting each model:
1. Test CRUD operations
2. Verify JSON fields are stored/retrieved correctly
3. Check foreign key relationships
4. Test with frontend to ensure compatibility

