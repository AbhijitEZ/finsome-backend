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

      res.status(200).json({ data: users, message: APP_SUCCESS_MESSAGE.login_success });
    } catch (error) {
      next(error);
    }
  };
}

export default AdminController;
