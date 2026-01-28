const validate = (schema) => {
  return (req, res, next) => {
    const options = {
      abortEarly: false, // return all errors
      allowUnknown: false, // disallow extra fields
      stripUnknown: true // remove unknown fields
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({
        error: 'Validation failed',
        details
      });
    }

    // use the validated/sanitized value
    req.body = value;
    next();
  };
};

module.exports = validate;

