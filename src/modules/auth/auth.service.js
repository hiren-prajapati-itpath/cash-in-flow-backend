import db from '../../database/models/index.js';

const { Users } = db;

export const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await Users.findOne({ where: { email } });

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

export default {
  loginUserWithEmailAndPassword,
};
