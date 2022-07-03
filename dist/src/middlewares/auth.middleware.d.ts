import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
declare const authMiddleware: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
export declare const authOptionalMiddleware: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
export declare const authAdminMiddleware: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
export default authMiddleware;
