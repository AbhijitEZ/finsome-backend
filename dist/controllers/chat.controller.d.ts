import ChatService from "../services/chat.service";
import { Request, Response, NextFunction } from "express";
declare class chatController {
    chatService: ChatService;
    createChannel: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default chatController;
