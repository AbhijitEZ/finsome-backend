import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import PostController from '@/controllers/post.controller';
import validationMiddleware from '@/middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { StockTypeDto } from '@/dtos/posts.dto';

class PostRoute implements Routes {
  public path = '/post/';
  public router = Router();
  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}countries`, this.postController.countriesController);
    this.router.get(`${this.path}stock-type`, validationMiddleware(StockTypeDto, 'query'), authMiddleware, this.postController.stockTypesController);
  }
}

export default PostRoute;
