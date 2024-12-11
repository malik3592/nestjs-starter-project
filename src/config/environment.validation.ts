import * as Joi from 'joi';
export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('local', 'development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().greater(1024),
  API_VERSION: Joi.string().required(),
  CONNECTION_STRING: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.number().required(),
  SWAGGER_USER: Joi.string().optional(),
  SWAGGER_PASSWORD: Joi.string().optional(),
});
