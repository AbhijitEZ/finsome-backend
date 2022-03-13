"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../utils/logger");
const errorMiddleware = (error, req, res, next) => {
    var _a;
    try {
        // @ts-ignore
        const status = error.status || error.code === 'LIMIT_FILE_SIZE' ? 400 : 500;
        const message = error.message || 'Something went wrong';
        const data = (_a = error.data) !== null && _a !== void 0 ? _a : {};
        logger_1.logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
        res.status(status).json({ data, message });
    }
    catch (error) {
        next(error);
    }
};
exports.default = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map