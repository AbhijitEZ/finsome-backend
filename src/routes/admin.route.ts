import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';

import validationMiddleware from '@middlewares/validation.middleware';
import { AdminLoginDto, PrivacyPolicyDto, SendNotificationDto, ToggleUserStatusDto } from '@/dtos/admin.dto';
import AdminController from '@/controllers/admin.controller';
import { authAdminMiddleware } from '@/middlewares/auth.middleware';
import { StockUpdateTypeDto } from '@/dtos/posts.dto';
import { fileUploadCB, fileUploadCSVCB } from '@/utils/global';

/**
 * This route would only be used by the Web panel specifc to admin.
 */
class AdminRoute implements Routes {
  public path = '/admin/';
  public router = Router();
  public adminController = new AdminController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}login`, validationMiddleware(AdminLoginDto, 'body'), this.adminController.adminLogin);
    /* User */
    this.router.post(`${this.path}users`, authAdminMiddleware, this.adminController.userListing);
    this.router.post(`${this.path}dashboard`, authAdminMiddleware, this.adminController.dashboardData);
    this.router.post(
      `${this.path}toggle-user-status`,
      validationMiddleware(ToggleUserStatusDto, 'body'),
      authAdminMiddleware,
      this.adminController.toggleUserStatus,
    );
    this.router.post(`${this.path}userById`, authAdminMiddleware, this.adminController.userById);
    this.router.post(`${this.path}deleteUser`, authAdminMiddleware, this.adminController.deleteUser);
    /* !User */

    /* App Suggestion and Contacts */
    this.router.post(`${this.path}app-improvement-suggestions`, authAdminMiddleware, this.adminController.appImprovementSuggestion);
    this.router.post(`${this.path}quick-contacts`, authAdminMiddleware, this.adminController.quickContactListing);
    /* !App Suggestion and Contacts */

    /* Stocks */
    this.router.post(
      `${this.path}stock/:type`,
      authAdminMiddleware,
      validationMiddleware(StockUpdateTypeDto, 'body'),
      this.adminController.stockTypeAdd,
    );
    this.router.delete(`${this.path}stock/:type/:id`, authAdminMiddleware, this.adminController.stockTypeDelete);
    this.router.post(`${this.path}stock-upload/:type`, authAdminMiddleware, fileUploadCSVCB, this.adminController.stockTypeUpload);
    /* !Stocks */

    /* Complaints */
    this.router.post(`${this.path}complaints`, authAdminMiddleware, this.adminController.complaintsListing);

    /* Policies */
    this.router.get(`${this.path}privacy-policy`, this.adminController.privacyPolicy);
    this.router.post(
      `${this.path}privacy-policy`,
      validationMiddleware(PrivacyPolicyDto, 'body'),
      authAdminMiddleware,
      this.adminController.privacyPolicyUpdate,
    );
    this.router.get(`${this.path}terms-condition`, this.adminController.termsConditionListing);
    this.router.post(
      `${this.path}terms-condition`,
      validationMiddleware(PrivacyPolicyDto, 'body'),
      authAdminMiddleware,
      this.adminController.termsConditionUpdate,
    );
    this.router.post(`${this.path}send-notification`, validationMiddleware(SendNotificationDto, 'body'), this.adminController.sendNotification);
    /* !Policies */

    //Article
    this.router.post(`${this.path}get-article-listing`, authAdminMiddleware, this.adminController.articleListing);
    this.router.post(`${this.path}save-article`, fileUploadCB, this.adminController.saveArticle);
    this.router.post(`${this.path}delete-article`, this.adminController.deleteArticle);
  }
}

export default AdminRoute;
