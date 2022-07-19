/// <reference types="mongoose" />
import { AdminLoginDto, PrivacyPolicyDto, ToggleUserStatusDto } from '../dtos/admin.dto';
import { User } from '../interfaces/users.interface';
import { StockUpdateTypeDto } from '../dtos/posts.dto';
declare class AdminService {
    users: import("mongoose").Model<User & import("mongoose").Document<any, any, any>, {}, {}>;
    appImprovement: import("mongoose").Model<import("../interfaces/general.interface").AppImprovementInf & import("mongoose").Document<any, any, any>, {}, {}>;
    quickContact: import("mongoose").Model<import("../interfaces/general.interface").QuickContactInf & import("mongoose").Document<any, any, any>, {}, {}>;
    userSuggestion: import("mongoose").Model<import("../interfaces/general.interface").UserSuggestionImproveInf & import("mongoose").Document<any, any, any>, {}, {}>;
    privacyPolicy: import("mongoose").Model<import("../interfaces/general.interface").PrivacyPolicyInf & import("mongoose").Document<any, any, any>, {}, {}>;
    termsConditionM: import("mongoose").Model<import("../interfaces/general.interface").PrivacyPolicyInf & import("mongoose").Document<any, any, any>, {}, {}>;
    complaintM: import("mongoose").Model<import("../interfaces/general.interface").ComplaintsInf & import("mongoose").Document<any, any, any>, {}, {}>;
    adminLogin(loginDto: AdminLoginDto): Promise<{
        token: string;
    }>;
    userListing(user: User): Promise<Record<string, any>>;
    dashboardData(user: User): Promise<Record<string, any>>;
    toggleUserStatus(user: ToggleUserStatusDto): Promise<void>;
    deleteUser(id: string): Promise<void>;
    privacyPolicyListing(): Promise<any>;
    privacyPolicyUpdate(data: PrivacyPolicyDto): Promise<void>;
    termsConditionListing(): Promise<any>;
    termsConditionUpdate(data: PrivacyPolicyDto): Promise<void>;
    appImprovementSuggestion(): Promise<any>;
    quickContactListing(): Promise<Record<string, any>>;
    complaintsListing(type: string): Promise<Record<string, any>>;
    stockTypeAdd(type: string, reqData: StockUpdateTypeDto): Promise<any>;
    stockTypeDelete(type: string, _id: string): Promise<any>;
    stockTypeUpload(type: string, path: string): Promise<any>;
    getAllUserTokens(userIds: []): Promise<any>;
}
export default AdminService;
