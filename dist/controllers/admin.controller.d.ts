import { NextFunction, Request, Response } from 'express';
import AdminService from '../services/admin.service';
declare class AdminController {
    adminService: AdminService;
    adminLogin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    userListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    toggleUserStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    privacyPolicy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    privacyPolicyUpdate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    appImprovementSuggestion: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    quickContactListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default AdminController;
