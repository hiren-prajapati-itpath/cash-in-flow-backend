import db from '../../database/models/index.js';
import { generateToken } from '../../services/jwt.service.js';
import { sendEmail } from '../../services/nodemailer.service.js';
import { generateOtp, validateOtp } from '../../shared/utils/common.js';
import getSignUpEmail from '../../templates/signupOTP.template.js';

const { Users } = db;

export const createUser = async (userBody) => {
  const { firstName, lastName, email, password, role, referralSource } = userBody;
  if (await Users.findOne({ where: { email, isVerified: true } })) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email is already taken');
  }
  const newUser = {
    firstName,
    lastName,
    email,
    password,
    role,
    referralSource,
  };
  const { otp, otpExpiration } = generateOtp();
  const emailContent = getSignUpEmail(otp, firstName);
  const mailOptions = {
    to: email,
    subject: 'Welcome to Cash In Flow - Complete Your Signup',
    html: emailContent,
  };
  await sendEmail(mailOptions);
  newUser.otp = otp;
  newUser.otpExpiration = otpExpiration;
  const unverifiedUser = await Users.findOne({ where: { email } });
  if (unverifiedUser) {
    await Users.update(newUser, { where: { email: unverifiedUser.email } });
  } else {
    await Users.create(newUser);
  }
  return newUser;
};

export const verifyUser = async (body) => {
  const { otp, email } = body;
  const user = await validateOtp(email, otp);
  if (!user) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'invalid_otp');
  }
  await Users.update({ otp: null, otpExpiration: null, isVerified: true }, { where: { email } });
  const tokenPayload = {
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    role: user?.role,
  };
  const token = await generateToken(tokenPayload);
  return {
    message: 'User varification Success!',
    data: { token },
  };
};

export const queryUsers = async (filter, options) => {
  const users = await Users.paginate(filter, options);
  return users;
};

export const getUserById = async (id) => {
  const user = Users.findById(id);
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }
  return user;
};

export const getUserByEmail = async (email) => {
  const user = await Users.findOne({ where: { email, isVerified: true } });
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }
  return user;
};

export const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await Users.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

export const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};
