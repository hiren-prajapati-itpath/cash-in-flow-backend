import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import db from '../../database/models/index.js';

const { Users } = db;

export const generateRandomKey = async () => {
  const passwordResetKey = uuidv4() + uuidv4();
  return passwordResetKey;
};

export const generateOtp = () => {
  const min = 100000;
  const max = 999999;
  const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return {
    otp: Math.floor(Math.random() * (max - min + 1)) + min,
    otpExpiration,
  };
};

export const validateOtp = async (email, otp) => {
  const user = await Users.findOne({
    where: {
      email,
      otp,
      otpExpiration: {
        [Op.gt]: new Date(), // Checks if otpExpiration is greater than the current time
      },
    },
  });

  // If user exists and OTP is valid
  if (user) {
    return user;
  }
  return false;
};
