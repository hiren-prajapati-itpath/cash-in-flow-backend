import { Router } from 'express';
import validate from '../../middlewares/validate.js';

import * as authController from './auth.controller.js';
import { register, login, changePassword, varifyRegister } from './auth.validation.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { systemRoles } from '../../shared/constants/constant.js';

const router = Router();

router.post('/register', validate(register), authController.register);
router.post('/register/varify', validate(varifyRegister), authController.verifyRegisteration);
router.post('/login', validate(login), authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post(
  '/change-password',
  authMiddleware([systemRoles.superAdmin, systemRoles.client, systemRoles.freelancer]),
  validate(changePassword),
  authController.changePassword
);

export default router;
