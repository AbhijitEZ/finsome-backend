import { NextFunction, Request, Response } from 'express';
import PostService from '@/services/post.service';
import { responseJSONMapper } from '@/utils/global';

class PostController {
  public postService = new PostService();

  public countriesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countries = await this.postService.countriesGetAll();
      responseJSONMapper(res, 200, countries);
    } catch (error) {
      next(error);
    }
  };
}

export default PostController;
