
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;


        Error.captureStackTrace(this, this.constructor);
    }
}

class ApiResponse {
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
    }
}

export { ApiError, ApiResponse };
