import db from '../../database/models/index.js';
import * as userService from '../users/users.service.js';
import { generateRandomKey } from '../../shared/utils/common.js';
import { generateResetPassToken, generateToken, verifyToken } from '../../services/jwt.service.js';
import { jwt as _jwt } from '../../config/config.js';
import { sendEmail } from '../../services/nodemailer.service.js';
import { hashPassword } from '../../services/bcrypt.service.js';
import getForgotPasswordEmail from '../../templates/forgotPassword.template.js';

const { Users } = db;

export const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await Users.findOne({ where: { email } });

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

export const sendForgotPasswordEmail = async (body) => {
  const { email, redirectUrl } = body;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }
  const passwordResetKey = await generateRandomKey();
  const resetPasswordToken = generateResetPassToken({ id: user.id, email: user.email, passwordResetKey });
  const emailContent = getForgotPasswordEmail(redirectUrl, resetPasswordToken);
  const mailOptions = {
    to: email,
    subject: 'Reset password',
    // html: `<h4>your reset link is: ${redirectUrl}?token=${resetPasswordToken}</h4>`,
    html: emailContent,
  };
  await sendEmail(mailOptions);
  await Users.update({ passwordResetKey }, { where: { email } });
};

export const resetUserPassword = async (query, body) => {
  const { token } = query;
  const { password } = body;
  const decoded = verifyToken(token);
  if (!decoded) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'password reset link is expired');
  }
  const isValidToUpdate = await Users.findOne({
    where: { email: decoded.email, passwordResetKey: decoded.passwordResetKey },
  });
  if (!isValidToUpdate) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'password reset link is expired');
  }
  const hashedPassword = await hashPassword(password);
  await Users.update({ password: hashedPassword, passwordResetKey: null }, { where: { email: decoded.email } });
};

export const updateUserPassword = async (userId, body) => {
  const { oldPassword, newPassword } = body;
  const user = await Users.findByPk(userId);
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'user not found');
  }
  const isMatch = await user.isPasswordMatch(oldPassword);
  if (!isMatch) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Old password is incorrect.');
  }
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();
};
