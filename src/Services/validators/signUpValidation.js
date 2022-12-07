const Joi = require('joi');

const SignUpSchemaValidator = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  nid: Joi.number().min(8).max(10).required(),
  profilePhoto: Joi.string(),
  isMarried: Joi.boolean().required(),
  age: Joi.number().min(16).required(),
  email: Joi.string().lowercase().required()
    .email({
      minDomainSegments: 3,
      tlds: { allow: ['com', 'net','org'] },
    })
  
    .required(),
  password: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

module.exports = SignUpSchemaValidator;
