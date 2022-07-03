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

  public stockTypesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.stockTypesShares(req.query);
      responseJSONMapper(res, 200, { ...data });
    } catch (error) {
      next(error);
    }
  };

  public userConfigurationListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.userConfigListing(req.user?._id);
      responseJSONMapper(res, 200, { ...data });
    } catch (error) {
      next(error);
    }
  };

  public userConfigurationUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.userConfigUpdate(req.user?._id, req.body);
      responseJSONMapper(res, 200, { ...data });
    } catch (error) {
      next(error);
    }
  };

  public postCreate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.postCreate(req.user?._id, req.body, req.files, req.params?.id);
      responseJSONMapper(res, 200, { ...data });
    } catch (error) {
      next(error);
    }
  };

  public postExplore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.postExplore();
      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public postHome = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.postHome(req.user?._id, req.query);
      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public stockSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.stockSearch(req.user?._id, req.query);
      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public postDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.postDelete(req.user?._id, req.params?.postId);
      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public postDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.postDetail(req.user?._id, req.params?.postId);
      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public postDeleteAssets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.postDeleteAssets(req.user?._id, req.params?.postId, req.query);
      responseJSONMapper(res, 200, { ...data });
    } catch (error) {
      next(error);
    }
  };

  public commentListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.commentListing(req.user?._id, req.query);
      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public commentAdd = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.commentAdd(req.user?._id, req.body);
      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public postLikeUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.postLikeUpdate(req.user?._id, req.user?.fullname, req.user?.profile_photo, req.body);
      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public complaintAdd = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.complaintAdd(req.user?._id, req.body);
      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public articleCatListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.articleCatListing();
      responseJSONMapper(res, 200, data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public commentDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.postService.commentDelete(req.user?._id, req.params?.postId, req.params?.id);
      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };
}

export default PostController;
