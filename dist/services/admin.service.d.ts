/// <reference types="mongoose" />
import { AdminLoginDto } from '../dtos/admin.dto';
import { User } from '../interfaces/users.interface';
declare class AdminService {
    users: import("mongoose").Model<User & import("mongoose").Document<any, any, any>, {}, {}>;
    adminLogin(loginDto: AdminLoginDto): Promise<{
        token: string;
    }>;
}
export default AdminService;
