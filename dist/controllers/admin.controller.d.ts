import { NextFunction, Request, Response } from 'express';
import AdminService from '../services/admin.service';
declare class AdminController {
    adminService: AdminService;
    adminLogin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    userListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default AdminController;
