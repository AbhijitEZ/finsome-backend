"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("config"));
const { host, port, database } = config_1.default.get('dbConfig');
exports.dbConnection = {
    url: process.env.DATABASE_URL || `mongodb://${host}:${port}/${database}`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    },
};
//# sourceMappingURL=index.js.map