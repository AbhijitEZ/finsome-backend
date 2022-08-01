import { NextFunction, Request, Response } from 'express';
import PostService from '../services/post.service';
declare class PostController {
    postService: PostService;
    countriesController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    articleListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    stockTypesController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    userConfigurationListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    userConfigurationUpdate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postCreate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postExplore: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postHome: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    stockSearch: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postDelete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postDetail: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postDeleteAssets: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    commentListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    commentAdd: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postLikeUpdate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    complaintAdd: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    articleCatListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    articleAdd: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    commentDelete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default PostController;
