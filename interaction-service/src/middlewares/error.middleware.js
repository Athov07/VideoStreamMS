import { logger } from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (!statusCode) statusCode = 500;

    const response = {
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    };

    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(statusCode).json(response);
};

export default errorMiddleware;