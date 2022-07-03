import { Routes } from '@interfaces/routes.interface';
import PostController from '@/controllers/post.controller';
declare class PostRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    postController: PostController;
    constructor();
    private initializeRoutes;
}
export default PostRoute;
