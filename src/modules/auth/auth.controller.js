import {
  loginUserWithEmailAndPassword,
  sendForgotPasswordEmail,
  resetUserPassword,
  updateUserPassword,
} from './auth.service.js';
import { usersServices } from '../users/index.js';
import { generateToken } from '../../services/jwt.service.js';

export const register = catchAsync(async (req, res) => {
  const user = await usersServices.createUser(req.body);
  return res.successResponse(STATUS_CODES.CREATED, { data: user, message: 'User registered successfully!' });
});

export const verifyRegisteration = catchAsync(async (req, res) => {
  const result = await usersServices.verifyUser(req.body);
  return res.successResponse(STATUS_CODES.OK, { data: result });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUserWithEmailAndPassword(email, password);
  if (!user.isVerified) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Please varify Your Account');
  }
  const tokenData = {
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    role: user?.role,
  };

  const token = generateToken(tokenData);
  return res.successResponse(STATUS_CODES.OK, { data: { token }, message: 'Login successful!' });
});

export const forgotPassword = catchAsync(async (req, res) => {
  await sendForgotPasswordEmail(req.body);
  return res.successResponse(STATUS_CODES.OK, { message: 'Forgot Password successful!' });
});

export const resetPassword = catchAsync(async (req, res) => {
  await resetUserPassword(req.query, req.body);
  return res.successResponse(STATUS_CODES.OK, { message: 'Reset Password successful!' });
});

export const changePassword = catchAsync(async (req, res) => {
  await updateUserPassword(req.user.id, req.body);
  return res.successResponse(STATUS_CODES.OK, { message: 'change Password successful!' });
});
