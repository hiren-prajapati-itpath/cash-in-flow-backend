import { verifyToken } from '../services/jwt.service.js';
import models from '../database/models/index.js';

const { User } = models;

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Authentication token is missing');
      }
      const decoded = verifyToken(token);

      const user = await User.findById(decoded.id);

      if (!user || (roles.length && !roles.includes(user.role))) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Access denied');
      }

      req.user = user;
      next();
    } catch (err) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized');
    }
  };
};

export default authMiddleware;
