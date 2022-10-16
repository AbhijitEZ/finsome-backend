import channelModel from '@/models/chats/channels';
import BankModel from '@/models/chats/banks';

class ChatService {

    private channelCreator = async (user: any, request: any) => {
        try {
            let existingChannel = await channelModel.find({ title: request.title });
            if (existingChannel.length == 1) {
                return {
                    status: 200,
                    data: null,
                    message: "Channel with this name is already exists!"
                };
            } else {
                request.createdBy = user._id;
                request.users = [{ userId: user._id, role: 'Admin' }];
                request.subscriptions = request.subscriptions != null && Array.isArray(request.subscriptions) ? request.subscriptions : [];
                let channel = await channelModel.create(request);
                return {
                    status: 200,
                    data: channel,
                    message: "Channel created successfully!"
                };
            }
        } catch (err: any) {
            return {
                status: 500,
                data: null,
                message: err.message
            };
        }
    }

    public createChannel = async (user: any, request: any) => {
        try {
            let hasSubscriptions = request.subscriptions != null ? request.subscriptions.length : 0
            if (hasSubscriptions > 0) {
                let hasBankDeatil = await BankModel.find({ createdBy: user._id });
                if (hasBankDeatil.length == 1) {
                    return await this.channelCreator(user, request);
                } else {
                    return {
                        status: 200,
                        data: null,
                        message: "To create a channel you need fill the bank deails first!"
                    };
                }
            } else {
                return await this.channelCreator(user, request);
            }
        } catch (err: any) {
            return {
                status: 500,
                data: null,
                message: err.message
            };
        }
    }
}

export default ChatService;