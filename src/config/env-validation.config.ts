import * as Joi from 'joi';
export const envValidationObjectSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().required(),
  DB_LOGGING: Joi.boolean().required(),
  PORT: Joi.number().required(),
  CLIENT_URL: Joi.string().required(),
  SECRET_OR_KEY: Joi.string().required(),
  HASH_PWD: Joi.string().required(),
  SECRET_AT: Joi.string().required(),
  SECRET_RT: Joi.string().required(),
  MAX_FILE_SIZE: Joi.number().required(),
  UPLOAD_TEMP_DIR: Joi.string().required(),
});
