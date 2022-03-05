import { hash, compare } from 'bcrypt';
import config from 'config';
import { sign } from 'jsonwebtoken';
import { toDate } from 'date-fns';
import { CreateUserDto, LoginDto, ValidateUserFieldDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { APP_ERROR_MESSAGE } from '@/utils/constants';

class AuthService {
  public users = userModel;

  public async validateUserField(userData: ValidateUserFieldDto): Promise<void> {
    const userFound = await this.users.findOne({ [userData.field]: userData.value });
    if (userFound) throw new HttpException(409, APP_ERROR_MESSAGE.user_field_exists);
  }

  public async signup(userData: CreateUserDto): Promise<{ cookie: string; user: Partial<User>; token_data: TokenData }> {
    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword, term_agree_timestamp: toDate(new Date()) });

    const token_data = this.createToken(createUserData);
    const cookie = this.createCookie(token_data);
    const userResponseFilter = this.userResponseFilter(createUserData);

    return { cookie, token_data, user: userResponseFilter };
  }

  public async login(userData: LoginDto): Promise<{ cookie: string; user: Partial<User>; token_data: TokenData }> {
    const findUser = await this.users.findOne({ phone_number: userData.phone_number }).lean();
    if (!findUser) throw new HttpException(409, APP_ERROR_MESSAGE.user_not_exists);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, APP_ERROR_MESSAGE.incorrect_password);
    const token_data = this.createToken(findUser);
    const cookie = this.createCookie(token_data);
    const userResponseFilter = this.userResponseFilter(findUser);

    return { cookie, token_data, user: userResponseFilter };
  }

  public async logout(userData: User): Promise<void> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);
  }

  public userResponseFilter(userData: User): Partial<User> {
    const user = { ...userData };
    delete user.password;
    delete user.term_agree_timestamp;
    delete user.updated_at;
    return user;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id, role: user.role };
    const secretKey: string = config.get('secretKey');
    const expiresIn: number = config.get('tokenExpiry');
    const token = sign(dataStoredInToken, secretKey, { expiresIn });

    return { expires_in: expiresIn, token };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expires_in};`;
  }
}

export default AuthService;
