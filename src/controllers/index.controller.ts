import { NextFunction, Request, Response } from 'express';
import { hash } from 'bcrypt';
import userModel from '@models/users.model';
import { APP_ERROR_MESSAGE, USER_ROLE } from '@/utils/constants';
import { HttpException } from '@/exceptions/HttpException';
import { toDate } from 'date-fns';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ env: process.env.NODE_ENV, port: process.env.PORT });
    } catch (error) {
      next(error);
    }
  };

  /* Script Start */

  /* Adding default admin for the initial system */
  public addAdminScript = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminExists = await userModel.findOne({
        role: USER_ROLE.ADMIN,
      });

      if (adminExists) {
        throw new HttpException(400, APP_ERROR_MESSAGE.user_already_register);
      }
      const hashedPassword = await hash('Finsom@123', 10);

      await userModel.create({
        phone_country_code: '+91',
        phone_number: '00000000000',
        username: 'admin_user',
        email: 'adminfinsom@yopmail.com',
        password: hashedPassword,
        term_agree_timestamp: toDate(new Date()),
        role: USER_ROLE.ADMIN,
      });

      res.status(200).json({ email: 'adminfinsom@yopmail.com' });
    } catch (error) {
      next(error);
    }
  };

  /* Script End */
}

export default IndexController;
