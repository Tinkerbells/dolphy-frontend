export enum FetchMethod {
  get = 'GET',
  put = 'PUT',
  post = 'POST',
  patch = 'PATCH',
};

export enum ResponseCode {
  FETCH_ERROR = 0,
  ABORT = 1,
  OK = 200,
  ANY_ERROR = 400,
  AUTH_ERROR = 401,
  COOKIES_EXPIRED = 403,
  NOT_FOUND = 404,
  VALIDATION_ERROR = 422,
};
