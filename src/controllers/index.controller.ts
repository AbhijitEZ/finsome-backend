import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ env: process.env.NODE_ENV, port: process.env.PORT });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
