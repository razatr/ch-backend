class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnautorizedError() {
    return new ApiError(401, 'Пользователь не авторизован');
  }

  static AccessError() {
    return new ApiError(403, 'Отказано в доступе');
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
}

export default ApiError