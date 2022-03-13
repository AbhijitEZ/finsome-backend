import { AdminLoginDto } from '@/dtos/admin.dto';
import config from 'config';
import { sign } from 'jsonwebtoken';
import { HttpException } from '@/exceptions/HttpException';
import { APP_ERROR_MESSAGE, USER_ROLE } from '@/utils/constants';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';

class AdminService {
  public users = userModel;

  public async adminLogin(loginDto: AdminLoginDto): Promise<{ token: string }> {
    const adminUser: User = await this.users.findOne({
      email: loginDto.email,
      password: loginDto.password,
      role: USER_ROLE.ADMIN,
    });

    if (!adminUser) {
      throw new HttpException(400, APP_ERROR_MESSAGE.user_not_exists);
    }

    const dataStoredInToken = { _id: adminUser._id, role: adminUser.role };
    const secretKey: string = config.get('secretKey');
    const expiresIn: number = config.get('tokenExpiry');
    const token = sign(dataStoredInToken, secretKey, { expiresIn });

    return { token };
  }
}

export default AdminService;
