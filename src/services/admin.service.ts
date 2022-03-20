import { AdminLoginDto, ToggleUserStatusDto } from '@/dtos/admin.dto';
import config from 'config';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { HttpException } from '@/exceptions/HttpException';
import { APP_ERROR_MESSAGE, USER_ROLE } from '@/utils/constants';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { profileImageGenerator } from '@/utils/util';
import { toDate } from 'date-fns';

class AdminService {
  public users = userModel;

  public async adminLogin(loginDto: AdminLoginDto): Promise<{ token: string }> {
    const adminUser: User = await this.users.findOne({
      email: loginDto.email,
      role: USER_ROLE.ADMIN,
    });

    if (!adminUser) {
      throw new HttpException(400, APP_ERROR_MESSAGE.user_not_exists);
    }

    const isPasswordMatching: boolean = await compare(loginDto.password, adminUser.password);
    if (!isPasswordMatching) throw new HttpException(409, APP_ERROR_MESSAGE.incorrect_password);

    const dataStoredInToken = { _id: adminUser._id, role: adminUser.role };
    const secretKey: string = config.get('secretKey');
    const expiresIn: number = config.get('tokenExpiry');
    const token = sign(dataStoredInToken, secretKey, { expiresIn });

    return { token };
  }

  public async userListing(user: User): Promise<Record<string, any>> {
    const users = await this.users
      .find({
        _id: { $ne: user._id },
        role: { $ne: USER_ROLE.ADMIN },
      })
      .select(['-password', '-updated_at', '-term_agree_timestamp'])
      .lean();

    const userSanitized = users.map(user => ({ ...user, profile_photo: profileImageGenerator(user.profile_photo) }));

    return userSanitized;
  }

  public async toggleUserStatus(user: ToggleUserStatusDto): Promise<void> {
    const findUser = await this.users.findOne({ _id: user.id }).lean();

    if (!findUser) throw new HttpException(409, APP_ERROR_MESSAGE.user_not_exists);

    await this.users.findByIdAndUpdate(user.id, { deleted_at: user.status ? toDate(new Date()) : null }, { new: true });
  }
}

export default AdminService;
