import countries from "@/models/countries";
import ChatService from "@/services/chat.service";
import { responseJSONMapper } from "@/utils/global";
import { Request, Response, NextFunction } from "express";

class chatController {
    public chatService = new ChatService();

    public createChannel = async (req: Request, res: Response, next: NextFunction) => {
        try{
            let result = await this.chatService.createChannel(req.user, req.body);
            responseJSONMapper(res, result.status, result.data, result.message);
        }catch(err){
            next(err);
        }
    }

}

export default chatController;