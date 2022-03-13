import { Routes } from '../interfaces/routes.interface';
import AdminController from '../controllers/admin.controller';
declare class AdminRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    adminController: AdminController;
    constructor();
    private initializeRoutes;
}
export default AdminRoute;
