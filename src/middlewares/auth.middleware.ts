import config from 'config';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@models/users.model';
import { APP_ERROR_MESSAGE, USER_ROLE } from '@/utils/constants';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = config.get('secretKey');
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        // @ts-ignore
        if (findUser.deleted_at) {
          return next(new HttpException(401, APP_ERROR_MESSAGE.user_blocked));
        }

        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, APP_ERROR_MESSAGE.invalid_token));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, APP_ERROR_MESSAGE.invalid_token));
  }
};

export const authOptionalMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;

    if (Authorization) {
      const secretKey: string = config.get('secretKey');
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        // @ts-ignore
        if (findUser.deleted_at) {
          return next(new HttpException(401, APP_ERROR_MESSAGE.user_blocked));
        }

        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, APP_ERROR_MESSAGE.invalid_token));
      }
    } else {
      next();
    }
  } catch (error) {
    next(new HttpException(401, APP_ERROR_MESSAGE.invalid_token));
  }
};

export const authAdminMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;

    if (Authorization) {
      const secretKey: string = config.get('secretKey');
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        if (findUser.role !== USER_ROLE.ADMIN) {
          return next(new HttpException(403, APP_ERROR_MESSAGE.forbidden_error));
        }

        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, APP_ERROR_MESSAGE.invalid_token));
      }
    } else {
      next(new HttpException(404, APP_ERROR_MESSAGE.invalid_token));
    }
  } catch (error) {
    next(new HttpException(401, APP_ERROR_MESSAGE.invalid_token));
  }
};

export default authMiddleware;
