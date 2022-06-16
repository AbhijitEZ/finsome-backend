import { NextFunction, Request, Response } from 'express';
import { hash } from 'bcrypt';
import userModel from '@models/users.model';
import { ACCOUNT_TYPE_CONST, APP_ERROR_MESSAGE, USER_CONFIGURATIONS, USER_ROLE } from '@/utils/constants';
import { HttpException } from '@/exceptions/HttpException';
import { toDate } from 'date-fns';
import userConfigurationModel from '@/models/user-configurations';

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

  /* Adding default admin for the initial system */
  public addNotificationDefaultToAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bulk = userModel.collection.initializeOrderedBulkOp();
      bulk.find({}).update({ $set: { allow_notification: true } });
      bulk.execute();

      res.status(200).json({ message: 'Updated all the user with initial allow notification = true' });
    } catch (error) {
      next(error);
    }
  };

  /* Update the existing user to have default configuration  [ONE Timer] */
  public updateDefaultConfigurationUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = userModel.aggregate([
        {
          $lookup: {
            from: USER_CONFIGURATIONS,
            localField: '_id',
            foreignField: 'user_id',
            as: 'user_conf',
          },
        },
      ]);

      const data = await users.exec();

      data.map(user => {
        if (!user.user_conf.length) {
          userConfigurationModel.create({ user_id: user._id, account_type: ACCOUNT_TYPE_CONST.PUBLIC });
          console.log(user._id, ' Added default config value');
        }
      });

      res.status(200).json({ data, message: 'Updated user to have default configuration' });
    } catch (error) {
      next(error);
    }
  };

  /* Script End */
}

export default IndexController;
