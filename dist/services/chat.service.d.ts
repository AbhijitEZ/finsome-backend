declare class ChatService {
    private channelCreator;
    createChannel: (user: any, request: any) => Promise<{
        status: number;
        data: any;
        message: any;
    }>;
}
export default ChatService;
