import { Routes } from '@interfaces/routes.interface';
import AdminController from '@/controllers/admin.controller';
/**
 * This route would only be used by the Web panel specifc to admin.
 */
declare class AdminRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    adminController: AdminController;
    constructor();
    private initializeRoutes;
}
export default AdminRoute;
