import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import PostController from '@/controllers/post.controller';
import validationMiddleware from '@/middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { PostCreateDto, PostHomeDto, StockTypeDto, UserConfigurationDto } from '@/dtos/posts.dto';
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
    this.router.get(`${this.path}explore`, authMiddleware, this.postController.postExplore);
    this.router.get(`${this.path}home`, authMiddleware, validationMiddleware(PostHomeDto, 'query'), this.postController.postHome);
  }
}

export default PostRoute;
