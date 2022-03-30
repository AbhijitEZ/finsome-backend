/// <reference types="mongoose" />
import { AdminLoginDto, ToggleUserStatusDto } from '../dtos/admin.dto';
import { User } from '../interfaces/users.interface';
declare class AdminService {
    users: import("mongoose").Model<User & import("mongoose").Document<any, any, any>, {}, {}>;
    appImprovement: import("mongoose").Model<import("../interfaces/general.interface").AppImprovementInf & import("mongoose").Document<any, any, any>, {}, {}>;
    quickContact: import("mongoose").Model<import("../interfaces/general.interface").QuickContactInf & import("mongoose").Document<any, any, any>, {}, {}>;
    userSuggestion: import("mongoose").Model<import("../interfaces/general.interface").UserSuggestionImproveInf & import("mongoose").Document<any, any, any>, {}, {}>;
    adminLogin(loginDto: AdminLoginDto): Promise<{
        token: string;
    }>;
    userListing(user: User): Promise<Record<string, any>>;
    toggleUserStatus(user: ToggleUserStatusDto): Promise<void>;
    appImprovementSuggestion(): Promise<any>;
    quickContactListing(): Promise<Record<string, any>>;
}
export default AdminService;
