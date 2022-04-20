import { NextFunction, Request, Response } from 'express';
import PostService from '../services/post.service';
declare class PostController {
    postService: PostService;
    countriesController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default PostController;