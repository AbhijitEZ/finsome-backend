import { NextFunction, Request, Response } from 'express';
import AdminService from '@services/admin.service';
import { APP_ERROR_MESSAGE, APP_SUCCESS_MESSAGE, STOCK_TYPE_CONST } from '@/utils/constants';
import { HttpException } from '@/exceptions/HttpException';
import firecustom from '@utils/firecustom';
import _lodash from 'lodash';

class AdminController {
  public adminService = new AdminService();

  public adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = await this.adminService.adminLogin(req.body);

      res.status(200).json({ data: { token }, message: APP_SUCCESS_MESSAGE.login_success });
    } catch (error) {
      next(error);
    }
  };

  public userListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.adminService.userListing(req.user, req);

      res.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  };

  public dashboardData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.adminService.dashboardData(req.user);
      res.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  };

  public toggleUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.adminService.toggleUserStatus(req.body);

      res.status(200).json({ data: {} });
    } catch (error) {
      next(error);
    }
  };

  public userById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        throw new HttpException(409, APP_ERROR_MESSAGE.id_not_exists);
      }
      let user: any = await this.adminService.getUser(userId);
      res.status(200).json({ data: user, message: APP_SUCCESS_MESSAGE.delete_user_success });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        throw new HttpException(409, APP_ERROR_MESSAGE.id_not_exists);
      }
      await this.adminService.deleteUser(userId);
      res.status(200).json({ data: {}, message: APP_SUCCESS_MESSAGE.delete_user_success });
    } catch (error) {
      next(error);
    }
  };

  public privacyPolicy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.adminService.privacyPolicyListing();

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public termsConditionListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.adminService.termsConditionListing();

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public termsConditionUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.adminService.termsConditionUpdate(req.body);

      res.status(200).json({ data: {} });
    } catch (error) {
      next(error);
    }
  };

  public privacyPolicyUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.adminService.privacyPolicyUpdate(req.body);

      res.status(200).json({ data: {} });
    } catch (error) {
      next(error);
    }
  };

  public appImprovementSuggestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.adminService.appImprovementSuggestion(req.body);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public quickContactListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.adminService.quickContactListing(req.body);
      res.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  };

  public complaintsListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.adminService.complaintsListing(req.body);

      res.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  };

  public stockTypeAdd = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.adminService.stockTypeAdd(req.params?.type || STOCK_TYPE_CONST.EQUITY, req.body);

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public stockTypeDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      await this.adminService.stockTypeDelete(req.params?.type || STOCK_TYPE_CONST.EQUITY, req.params?.id);

      res.status(200).json({ data: {} });
    } catch (error) {
      next(error);
    }
  };

  public stockTypeUpload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      await this.adminService.stockTypeUpload(req.params?.type || STOCK_TYPE_CONST.EQUITY, req.file.path);

      res.status(200).json({ data: {}, message: APP_SUCCESS_MESSAGE.csv_upload_success });
    } catch (error) {
      next(error);
    }
  };

  public articleListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let response = await this.adminService.getArticles(req.body);
      res.status(200).json({ data: response, message: 'Article listing!' });
    } catch (error) {
      next(error);
    }
  };

  public saveArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let response = await this.adminService.saveArticle(req.body, req.file);
      res.status(200).json({ data: response, message: response ? 'Article saved!' : 'Unable to save article' });
    } catch (error) {
      next(error);
    }
  };

  public deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let response = await this.adminService.deleteArticle(req.body);
      res.status(200).json({ data: response, message: response ? 'Article deleted!' : 'Unable to delete article' });
    } catch (error) {
      next(error);
    }
  };

  public sendNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const title = req.body.title;
      const body = req.body.body;
      const userIds = req.body.userIds;
      let tokens = await this.adminService.getAllUserTokens(userIds);

      let promises: any[] = [];
      const chunks = _lodash.chunk(tokens, 100);
      chunks.forEach(e => {
        const msg = {
          notification: {
            title: title,
            body: body,
          },
          tokens: e,
          android: {
            priority: 'high',
          },
        };
        promises.push(firecustom.sendAllNotification(msg));
      });
      const result = await Promise.all(promises);
      let accepted = 0;
      let rejected = 0;
      result.forEach(response => {
        if (response != undefined) {
          accepted += response.successCount;
          rejected += response.failureCount;
        }
      });
      res.status(200).json({ data: { accepted, rejected }, message: APP_SUCCESS_MESSAGE.notification_success });
    } catch (error) {
      next(error);
    }
  };
}

export default AdminController;
