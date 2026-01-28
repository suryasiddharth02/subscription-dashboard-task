const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').default('user')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const planSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().required(),
  duration: Joi.number().integer().positive().required(),
  features: Joi.array().items(Joi.string()).min(1).required()
});

const subscribeSchema = Joi.object({
  planId: Joi.number().integer().positive().required()
});

module.exports = {
  registerSchema,
  loginSchema,
  planSchema,
  subscribeSchema
};