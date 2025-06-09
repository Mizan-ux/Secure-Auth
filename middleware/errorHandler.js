// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // 🧪 1. Zod Validation Error
    if (err.name === 'ZodError') {
        statusCode = 400;
        message = err.errors?.map(e => e.message) || ['Validation failed'];
    }

    // 🧪 2. Mongoose CastError (invalid _id)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // 🧪 3. Mongoose Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate field value for ${field}: '${err.keyValue[field]}'`;
    }

    // 🧪 4. JWT Token Error
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token, please log in again';
    }

    // 🧪 5. JWT Expired Error
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired, please log in again';
    }

    // ✨ Final response
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
};




export default errorHandler;