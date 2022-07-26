import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import PostController from '@/controllers/post.controller';
import validationMiddleware from '@/middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import {
  ArticleAddDto,
  CommentsAddDto,
  ComplaintAddDto,
  IdPaginationDto,
  LikePostDto,
  PostAssetDeleteDto,
  PostCreateDto,
  PostHomeDto,
  StockSearchDto,
  StockTypeDto,
  UserConfigurationDto,
} from '@/dtos/posts.dto';
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
    this.router.post(
      `${this.path}create/:id`,
      authMiddleware,
      fileUploadPostCB,
      validationMiddleware(PostCreateDto, 'body'),
      this.postController.postCreate,
    );
    this.router.delete(
      `${this.path}delete-asset/:postId`,
      validationMiddleware(PostAssetDeleteDto, 'query'),
      authMiddleware,
      this.postController.postDeleteAssets,
    );
    this.router.get(`${this.path}detail/:postId`, authMiddleware, this.postController.postDetail);
    this.router.delete(`${this.path}delete/:postId`, authMiddleware, this.postController.postDelete);
    this.router.post(`${this.path}delete`, authMiddleware, this.postController.postDelete);
    this.router.get(`${this.path}explore`, authMiddleware, this.postController.postExplore);
    this.router.get(`${this.path}home`, authMiddleware, validationMiddleware(PostHomeDto, 'query'), this.postController.postHome);
    this.router.post(`${this.path}home`, authMiddleware, validationMiddleware(PostHomeDto, 'body'), this.postController.postHome);
    this.router.get(`${this.path}stocks/search`, authMiddleware, validationMiddleware(StockSearchDto, 'query'), this.postController.stockSearch);

    this.router.post(`${this.path}comment`, authMiddleware, validationMiddleware(CommentsAddDto, 'body'), this.postController.commentAdd);
    this.router.get(`${this.path}comment`, authMiddleware, validationMiddleware(IdPaginationDto, 'query'), this.postController.commentListing);
    this.router.delete(`${this.path}comment/:postId/:id`, authMiddleware, this.postController.commentDelete);
    this.router.post(`${this.path}like`, authMiddleware, validationMiddleware(LikePostDto, 'body'), this.postController.postLikeUpdate);
    this.router.post(`${this.path}complaint`, authMiddleware, validationMiddleware(ComplaintAddDto, 'body'), this.postController.complaintAdd);
    this.router.post(`${this.path}article-categories`, authMiddleware, validationMiddleware(ArticleAddDto, 'body'), this.postController.articleAdd);
    this.router.get(`${this.path}article-categories`, authMiddleware, this.postController.articleCatListing);
  }
}

export default PostRoute;
