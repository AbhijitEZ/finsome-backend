"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Sentry = tslib_1.__importStar(require("@sentry/node"));
const logger_1 = require("../utils/logger");
const errorMiddleware = (error, req, res, next) => {
    var _a;
    try {
        // @ts-ignore
        const status = (error === null || error === void 0 ? void 0 : error.code) === 'LIMIT_FILE_SIZE' ? 400 : error.status ? error.status : 500;
        const message = error.message || 'Something went wrong';
        const data = (_a = error.data) !== null && _a !== void 0 ? _a : {};
        const errorMes = `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`;
        Sentry.captureException(error, {
            tags: {
                section: 'error_middleware',
            },
        });
        logger_1.logger.error(errorMes);
        res.status(status).json({ data, message });
    }
    catch (error) {
        console.log('WIRED ERROR CHECK: ', error);
        next(error);
    }
};
exports.default = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map