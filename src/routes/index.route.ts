import { Router } from 'express';
import IndexController from '@controllers/index.controller';
import { Routes } from '@interfaces/routes.interface';

class IndexRoute implements Routes {
  public path = '/';
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.indexController.index);

    // SCRIPT
    this.router.get(`${this.path}script/add-admin`, this.indexController.addAdminScript);
    this.router.get(`${this.path}script/default-notification`, this.indexController.addNotificationDefaultToAllUser);
    this.router.get(`${this.path}script/user-config-default`, this.indexController.updateDefaultConfigurationUsers);
  }
}

export default IndexRoute;
