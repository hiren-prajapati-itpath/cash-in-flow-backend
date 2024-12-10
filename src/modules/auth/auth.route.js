import { Router } from 'express';
import validate from '../../middlewares/validate.js';

import authAppController from './auth.controller.js';
import { register, login } from './auth.validation.js';

const router = Router();

router.post('/register', validate(register), authAppController.register);
router.post('/login', validate(login), authAppController.login);

export default router;
