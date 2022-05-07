import { NextFunction, Request, Response } from 'express';
import PostService from '../services/post.service';
declare class PostController {
    postService: PostService;
    countriesController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    stockTypesController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    userConfigurationListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    userConfigurationUpdate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postCreate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postExplore: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default PostController;
