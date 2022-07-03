/// <reference types="mongoose" />
import { User } from '../interfaces/users.interface';
declare class UserService {
    users: import("mongoose").Model<User & import("mongoose").Document<any, any, any>, {}, {}>;
    findAllUser(): Promise<User[]>;
    findUserById(userId: string): Promise<User>;
    deleteUser(userId: string): Promise<User>;
}
export default UserService;
