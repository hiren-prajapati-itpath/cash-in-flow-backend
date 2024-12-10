import { loginUserWithEmailAndPassword } from './auth.service.js';
import { usersServices } from '../users/index.js';
import { generateToken } from '../../services/jwt.service.js';

const register = catchAsync(async (req, res) => {
  const user = await usersServices.createUser(req.body);
  return res.successResponse(STATUS_CODES.CREATED, { data: user });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUserWithEmailAndPassword(email, password);

  const token = generateToken(user);
  return res.successResponse(STATUS_CODES.OK, { data: { token }, message: 'Login successful !' });
});

export default {
  register,
  login,
};
