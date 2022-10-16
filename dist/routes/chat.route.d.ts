import { Routes } from '../interfaces/routes.interface';
import chatController from '../controllers/chat.controller';
declare class ChatRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    chatController: chatController;
    constructor();
    private initializeRoutes;
}
export default ChatRoute;
