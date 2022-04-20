import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import PostController from '@/controllers/post.controller';

class PostRoute implements Routes {
  public path = '/post/';
  public router = Router();
  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}countries`, this.postController.countriesController);
  }
}

export default PostRoute;
