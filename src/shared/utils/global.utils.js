import { catchAsync, ApiError, STATUS_CODES } from './index.js';

globalThis.catchAsync = catchAsync;
globalThis.ApiError = ApiError;
globalThis.STATUS_CODES = STATUS_CODES;
