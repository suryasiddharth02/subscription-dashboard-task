const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const { subscribeSchema } = require('../validation/schemas');
const validate = require('../middleware/validate');

// Subscribe to a plan
router.post('/subscribe/:planId', authenticateToken, async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;

    // Check if plan exists
    const plan = await db('plans').where({ id: planId, is_active: true }).first();
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Check if user already has active subscription
    const existingSubscription = await db('subscriptions')
      .where({
        user_id: userId,
        status: 'active'
      })
      .first();

    if (existingSubscription) {
      return res.status(400).json({ error: 'You already have an active subscription' });
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    // Create subscription
    const [subscription] = await db('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        start_date: startDate,
        end_date: endDate,
        status: 'active'
      })
      .returning('*');

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription,
      plan
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Subscription failed' });
  }
});

// Get user's current subscription
router.get('/my-subscription', authenticateToken, async (req, res) => {
  try {
    const subscription = await db('subscriptions as s')
      .join('plans as p', 's.plan_id', 'p.id')
      .where({
        's.user_id': req.user.id,
        's.status': 'active'
      })
      .select(
        's.*',
        'p.name as plan_name',
        'p.price',
        'p.features',
        'p.duration'
      )
      .first();

    if (!subscription) {
      return res.json({ subscription: null, message: 'No active subscription' });
    }

    res.json({ subscription });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Change user's subscription to a new plan (upgrade/downgrade)
router.post('/change/:planId', authenticateToken, async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;

    const plan = await db('plans').where({ id: planId, is_active: true }).first();
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    // Find current active subscription
    const subscription = await db('subscriptions')
      .where({ user_id: userId, status: 'active' })
      .first();

    if (!subscription) return res.status(400).json({ error: 'No active subscription to change' });

    // Update subscription: change plan_id and adjust end_date according to new plan duration
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const [updated] = await db('subscriptions')
      .where({ id: subscription.id })
      .update({ plan_id: planId, start_date: startDate, end_date: endDate })
      .returning('*');

    return res.json({ message: 'Subscription changed', subscription: updated, plan });
  } catch (error) {
    console.error('Change subscription error:', error);
    return res.status(500).json({ error: 'Failed to change subscription' });
  }
});

// Cancel active subscription
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const subscription = await db('subscriptions')
      .where({ user_id: userId, status: 'active' })
      .first();

    if (!subscription) return res.status(400).json({ error: 'No active subscription to cancel' });

    await db('subscriptions').where({ id: subscription.id }).update({ status: 'cancelled' });

    return res.json({ message: 'Subscription cancelled' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

module.exports = router;
