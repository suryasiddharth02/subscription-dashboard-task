const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Admin middleware
router.use(authenticateToken, authorizeRole('admin'));

// Get all subscriptions
router.get('/subscriptions', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = db('subscriptions as s')
      .join('users as u', 's.user_id', 'u.id')
      .join('plans as p', 's.plan_id', 'p.id')
      .select(
        's.*',
        'u.name as user_name',
        'u.email as user_email',
        'p.name as plan_name',
        'p.price'
      )
      .orderBy('s.created_at', 'desc');

    if (status) {
      query = query.where('s.status', status);
    }

    const subscriptions = await query
      .limit(limit)
      .offset(offset);

    const total = await db('subscriptions').count('* as count').first();

    res.json({
      subscriptions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.count),
        pages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await db('users')
      .select('id', 'name', 'email', 'role', 'created_at')
      .orderBy('created_at', 'desc');

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create new plan (admin only)
router.post('/plans', async (req, res) => {
  try {
    const { name, price, duration, features } = req.body;

    const [plan] = await db('plans')
      .insert({
        name,
        price,
        duration,
        features: JSON.stringify(features),
        is_active: true
      })
      .returning('*');

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

module.exports = router;