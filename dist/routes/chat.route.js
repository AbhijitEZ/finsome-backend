"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const chat_controller_1 = tslib_1.__importDefault(require("../controllers/chat.controller"));
class ChatRoute {
    constructor() {
        this.path = '/chat/';
        this.router = (0, express_1.Router)();
        this.chatController = new chat_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}create-channel`, this.chatController.createChannel);
    }
}
exports.default = ChatRoute;
//# sourceMappingURL=chat.route.js.map