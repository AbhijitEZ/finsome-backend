import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import PostController from '@/controllers/post.controller';
import validationMiddleware from '@/middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { CommentsAddDto, IdPaginationDto, LikePostDto, PostCreateDto, PostHomeDto, StockTypeDto, UserConfigurationDto } from '@/dtos/posts.dto';
import { fileUploadPostCB } from '@/utils/global';

class PostRoute implements Routes {
  public path = '/post/';
  public router = Router();
  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}countries`, this.postController.countriesController);
    this.router.get(`${this.path}stock-type`, authMiddleware, validationMiddleware(StockTypeDto, 'query'), this.postController.stockTypesController);
    this.router.get(`${this.path}user-configurations`, authMiddleware, this.postController.userConfigurationListing);
    this.router.post(
      `${this.path}user-configurations`,
      authMiddleware,
      validationMiddleware(UserConfigurationDto, 'body'),
      this.postController.userConfigurationUpdate,
    );
    this.router.post(
      `${this.path}create`,
      authMiddleware,
      fileUploadPostCB,
      validationMiddleware(PostCreateDto, 'body'),
      this.postController.postCreate,
    );
    this.router.delete(`${this.path}delete/:postId`, authMiddleware, this.postController.postDelete);
    this.router.get(`${this.path}explore`, authMiddleware, this.postController.postExplore);
    this.router.get(`${this.path}home`, authMiddleware, validationMiddleware(PostHomeDto, 'query'), this.postController.postHome);
    this.router.post(`${this.path}comment`, authMiddleware, validationMiddleware(CommentsAddDto, 'body'), this.postController.commentAdd);
    this.router.get(`${this.path}comment`, authMiddleware, validationMiddleware(IdPaginationDto, 'query'), this.postController.commentListing);
    this.router.delete(`${this.path}comment/:postId/:id`, authMiddleware, this.postController.commentDelete);
    this.router.post(`${this.path}like`, authMiddleware, validationMiddleware(LikePostDto, 'body'), this.postController.postLikeUpdate);
  }
}

export default PostRoute;
