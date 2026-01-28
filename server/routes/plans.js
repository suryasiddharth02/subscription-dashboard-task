const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all plans
router.get('/', async (req, res) => {
  try {
    const plans = await db('plans')
      .where({ is_active: true })
      .select('*')
      .orderBy('price', 'asc');

    res.json(plans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Get single plan
router.get('/:id', async (req, res) => {
  try {
    const plan = await db('plans')
      .where({ id: req.params.id, is_active: true })
      .first();

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

module.exports = router;