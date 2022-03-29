import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const status: number = error?.code === 'LIMIT_FILE_SIZE' ? 400 : error.status ? error.status : 500;
    const message: string = error.message || 'Something went wrong';
    const data: any = error.data ?? {};

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ data, message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
