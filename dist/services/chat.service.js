"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const channels_1 = tslib_1.__importDefault(require("../models/chats/channels"));
const banks_1 = tslib_1.__importDefault(require("../models/chats/banks"));
class ChatService {
    constructor() {
        this.channelCreator = async (user, request) => {
            try {
                let existingChannel = await channels_1.default.find({ title: request.title });
                if (existingChannel.length == 1) {
                    return {
                        status: 200,
                        data: null,
                        message: "Channel with this name is already exists!"
                    };
                }
                else {
                    request.createdBy = user._id;
                    request.users = [{ userId: user._id, role: 'Admin' }];
                    request.subscriptions = request.subscriptions != null && Array.isArray(request.subscriptions) ? request.subscriptions : [];
                    let channel = await channels_1.default.create(request);
                    return {
                        status: 200,
                        data: channel,
                        message: "Channel created successfully!"
                    };
                }
            }
            catch (err) {
                return {
                    status: 500,
                    data: null,
                    message: err.message
                };
            }
        };
        this.createChannel = async (user, request) => {
            try {
                let hasSubscriptions = request.subscriptions != null ? request.subscriptions.length : 0;
                if (hasSubscriptions > 0) {
                    let hasBankDeatil = await banks_1.default.find({ createdBy: user._id });
                    if (hasBankDeatil.length == 1) {
                        return await this.channelCreator(user, request);
                    }
                    else {
                        return {
                            status: 200,
                            data: null,
                            message: "To create a channel you need fill the bank deails first!"
                        };
                    }
                }
                else {
                    return await this.channelCreator(user, request);
                }
            }
            catch (err) {
                return {
                    status: 500,
                    data: null,
                    message: err.message
                };
            }
        };
    }
}
exports.default = ChatService;
//# sourceMappingURL=chat.service.js.map