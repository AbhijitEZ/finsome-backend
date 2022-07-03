"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("@/index");
const config_1 = tslib_1.__importDefault(require("config"));
const compression_1 = tslib_1.__importDefault(require("compression"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const express_1 = tslib_1.__importDefault(require("express"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const hpp_1 = tslib_1.__importDefault(require("hpp"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const mongoose_1 = require("mongoose");
const _databases_1 = require("..");
const aws_1 = tslib_1.__importDefault(require("@utils/aws"));
const error_middleware_1 = tslib_1.__importDefault(require("@middlewares/error.middleware"));
const logger_1 = require("@utils/logger");
const Sentry = tslib_1.__importStar(require("@sentry/node"));
const Tracing = tslib_1.__importStar(require("@sentry/tracing"));
class App {
    constructor(routes) {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 5000;
        this.env = process.env.NODE_ENV || 'development';
        Sentry.init({
            dsn: 'https://89f27eaaefca4089991ab5886e0fa0de@o1198063.ingest.sentry.io/6320676',
            integrations: [
                // enable HTTP calls tracing
                new Sentry.Integrations.Http({ tracing: true }),
                // enable Express.js middleware tracing
                new Tracing.Integrations.Express({ app: this.app }),
            ],
            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,
        });
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
        aws_1.default.init();
        require('./utils/firecustom.ts');
    }
    listen() {
        this.app.listen(this.port, () => {
            logger_1.logger.info(`=================================`);
            logger_1.logger.info(`======= ENV: ${this.env} =======`);
            logger_1.logger.info(`🚀 App listening on the port ${this.port}`);
            logger_1.logger.info(`=================================`);
        });
    }
    getServer() {
        return this.app;
    }
    connectToDatabase() {
        if (this.env !== 'production') {
            (0, mongoose_1.set)('debug', true);
        }
        (0, mongoose_1.connect)(_databases_1.dbConnection.url, _databases_1.dbConnection.options);
    }
    initializeMiddlewares() {
        this.app.use(Sentry.Handlers.requestHandler());
        this.app.use(Sentry.Handlers.tracingHandler());
        this.app.use((0, morgan_1.default)(config_1.default.get('log.format'), { stream: logger_1.stream }));
        this.app.use((0, cors_1.default)({ origin: config_1.default.get('cors.origin'), credentials: config_1.default.get('cors.credentials') }));
        this.app.use((0, hpp_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use((0, compression_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cookie_parser_1.default)());
    }
    initializeRoutes(routes) {
        routes.forEach(route => {
            this.app.use('/api/', route.router);
        });
    }
    initializeErrorHandling() {
        this.app.use(Sentry.Handlers.errorHandler());
        this.app.use(error_middleware_1.default);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map