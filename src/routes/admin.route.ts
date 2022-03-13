import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';

import validationMiddleware from '@middlewares/validation.middleware';
import { AdminLoginDto } from '@/dtos/admin.dto';
import AdminController from '@/controllers/admin.controller';

class AdminRoute implements Routes {
  public path = '/admin/';
  public router = Router();
  public adminController = new AdminController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}login`, validationMiddleware(AdminLoginDto, 'body'), this.adminController.adminLogin);
  }
}

export default AdminRoute;
