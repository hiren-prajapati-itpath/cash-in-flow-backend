import { Router } from 'express';
import * as userController from './users.controller.js';
import { createUser, getUsers, getUser, updateUser, deleteUser } from './users.validation.js';
import validate from '../../middlewares/validate.js';

const router = Router();

router.route('/').post(validate(createUser), userController.createUser).get(validate(getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(validate(getUser), userController.getUser)
  .patch(validate(updateUser), userController.updateUser)
  .delete(validate(deleteUser), userController.deleteUser);

export default router;
