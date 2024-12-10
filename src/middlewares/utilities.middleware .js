import catchAsync from '../shared/utils/catchAsync.js';
import successResponseHelper from '../shared/utils/successResponse.js';
import ApiError from '../shared/utils/ApiError.js';
import STATUS_CODES from '../shared/utils/statusCode.js';

const utilitiesMiddleware = (req, res, next) => {
  res.catchAsync = catchAsync;
  res.successResponse = successResponseHelper.successResponse;
  res.ApiError = ApiError;
  res.STATUS_CODES = STATUS_CODES;
  next();
};

export default utilitiesMiddleware;
