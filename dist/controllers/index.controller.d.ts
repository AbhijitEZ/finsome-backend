import { NextFunction, Request, Response } from 'express';
declare class IndexController {
    index: (req: Request, res: Response, next: NextFunction) => void;
    addAdminScript: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default IndexController;
