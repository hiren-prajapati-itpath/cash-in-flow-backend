import Joi from 'joi';
import { password } from '../../shared/validations/custom.validation.js';

export const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    role: Joi.string().optional(),
    referralSource: Joi.string().optional(),
  }),
};

export const varifyRegister = {
  email: Joi.string().required().email(),
  otp: Joi.string().required(),
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const headerSchema = {
  headers: Joi.object({
    authorization: Joi.string()
      .required()
      .pattern(/^Bearer\s/)
      .messages({
        'string.empty': 'Authorization header is required!',
        'string.pattern.base': "Authorization header must start with 'Bearer '",
      }),
  }).unknown(),
};

export const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required().custom(password),
  }),
};
