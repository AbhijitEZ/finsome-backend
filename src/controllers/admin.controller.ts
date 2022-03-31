import { NextFunction, Request, Response } from 'express';
import AdminService from '@services/admin.service';
import { APP_SUCCESS_MESSAGE } from '@/utils/constants';

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
      const users = await this.adminService.userListing(req.user);

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

  public privacyPolicy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.adminService.privacyPolicyListing();

      res.status(200).json({ data });
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
      const data = await this.adminService.appImprovementSuggestion();

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public quickContactListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.adminService.quickContactListing();

      res.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  };
}

export default AdminController;
