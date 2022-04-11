import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import * as Sentry from '@sentry/node';
import { logger } from '@utils/logger';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const status: number = error?.code === 'LIMIT_FILE_SIZE' ? 400 : error.status ? error.status : 500;
    const message: string = error.message || 'Something went wrong';
    const data: any = error.data ?? {};
    const errorMes = `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`;

    Sentry.captureException(error, {
      tags: {
        section: 'error_middleware',
      },
    });
    logger.error(errorMes);
    res.status(status).json({ data, message });
  } catch (error) {
    console.log('WIRED ERROR CHECK: ', error);
    next(error);
  }
};

export default errorMiddleware;
