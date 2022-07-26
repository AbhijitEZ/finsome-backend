/// <reference types="mongoose" />
/// <reference types="mongoose-paginate-v2" />
import { User } from '../interfaces/users.interface';
declare class UserService {
    users: import("mongoose").Model<import("mongoose").Document<any, any, any>, any, any>;
    findAllUser(): Promise<User[]>;
    findUserById(userId: string): Promise<User>;
    deleteUser(userId: string): Promise<User>;
}
export default UserService;
