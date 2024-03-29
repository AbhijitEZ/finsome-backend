"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("dotenv/config");
require("./index");
const app_1 = tslib_1.__importDefault(require("./app"));
const auth_route_1 = tslib_1.__importDefault(require("./routes/auth.route"));
const index_route_1 = tslib_1.__importDefault(require("./routes/index.route"));
const users_route_1 = tslib_1.__importDefault(require("./routes/users.route"));
const admin_route_1 = tslib_1.__importDefault(require("./routes/admin.route"));
const post_route_1 = tslib_1.__importDefault(require("./routes/post.route"));
const chat_route_1 = tslib_1.__importDefault(require("./routes/chat.route"));
const app = new app_1.default([new index_route_1.default(), new users_route_1.default(), new auth_route_1.default(), new admin_route_1.default(), new post_route_1.default(), new chat_route_1.default()]);
app.listen();
//# sourceMappingURL=server.js.map