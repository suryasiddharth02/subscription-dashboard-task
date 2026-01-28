require('dotenv').config();
const db = require('./config/db');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Clear existing data (optional - comment out in production)
    await db('subscriptions').del();
    await db('plans').del();
    await db('users').del();

    // Create test users
    const users = await db('users').insert([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: '$2a$10$YourHashedPasswordHere', // Use bcrypt to generate in production
        role: 'admin'
      },
      {
        name: 'Test User',
        email: 'user@example.com',
        password: '$2a$10$YourHashedPasswordHere',
        role: 'user'
      }
    ]).returning('*');

    console.log('Created users:', users.length);

    // Create sample plans
    const plans = await db('plans').insert([
      {
        name: 'Basic Plan',
        price: 9.99,
        duration: 30,
        features: JSON.stringify(['Feature 1', 'Feature 2', 'Feature 3']),
        is_active: true
      },
      {
        name: 'Pro Plan',
        price: 19.99,
        duration: 30,
        features: JSON.stringify(['All Basic Features', 'Priority Support', 'Advanced Analytics']),
        is_active: true
      },
      {
        name: 'Enterprise Plan',
        price: 49.99,
        duration: 90,
        features: JSON.stringify(['All Pro Features', 'Custom Integration', '24/7 Phone Support', 'Dedicated Manager']),
        is_active: true
      },
      {
        name: 'Free Trial',
        price: 0.00,
        duration: 7,
        features: JSON.stringify(['Limited Features', 'Basic Support']),
        is_active: true
      }
    ]).returning('*');

    console.log('Created plans:', plans.length);

    // Create sample subscription
    const subscription = await db('subscriptions').insert({
      user_id: users[1].id,
      plan_id: plans[0].id,
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'active'
    }).returning('*');

    console.log('Created subscription for test user');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();