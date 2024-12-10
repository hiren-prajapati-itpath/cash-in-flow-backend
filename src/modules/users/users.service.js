import models from '../../database/models/index.js';

const { Users } = models;

const createUser = async (userBody) => {
  const { firstName, lastName, email, password, role } = userBody;

  if (await Users.findOne({ where: { email } })) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email is already taken');
  }

  const newUser = await Users.create({
    firstName,
    lastName,
    email,
    password,
    role,
  });
  return { message: 'User registered successfully', user: newUser };
};

const queryUsers = async (filter, options) => {
  const users = await Users.paginate(filter, options);
  return users;
};

const getUserById = async (id) => {
  const user = Users.findById(id);
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }
  return user;
};

const getUserByEmail = async (email) => {
  const user = Users.findOne({ email });
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }
  return user;
};

const updateUserById = async (userId, updateBody) => {
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

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
