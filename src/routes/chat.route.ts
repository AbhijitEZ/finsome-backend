import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import chatController from '@/controllers/chat.controller';

class ChatRoute implements Routes{
    public path = '/chat/';
    public router = Router();
    public chatController = new chatController();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}create-channel`, this.chatController.createChannel);
    }
}

export default ChatRoute;