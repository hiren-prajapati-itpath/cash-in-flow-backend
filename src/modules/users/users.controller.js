import pick from '../../shared/utils/pick.js';
import userService from './users.service.js';

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  return res.successResponse(STATUS_CODES.CREATED, { data: user });
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  return res.successResponse(STATUS_CODES.OK, { data: result });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  return res.successResponse(STATUS_CODES.OK, { data: user });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(STATUS_CODES.NO_CONTENT).send();
});

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};