"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chat_service_1 = tslib_1.__importDefault(require("../services/chat.service"));
const global_1 = require("../utils/global");
class chatController {
    constructor() {
        this.chatService = new chat_service_1.default();
        this.createChannel = async (req, res, next) => {
            try {
                let result = await this.chatService.createChannel(req.user, req.body);
                (0, global_1.responseJSONMapper)(res, result.status, result.data, result.message);
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.default = chatController;
//# sourceMappingURL=chat.controller.js.map