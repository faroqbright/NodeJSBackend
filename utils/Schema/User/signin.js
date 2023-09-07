const Joi = require("joi");

const signin_schema = Joi.object({
  UID: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = signin_schema;
