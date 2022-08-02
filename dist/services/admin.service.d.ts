/// <reference types="multer" />
import { AdminLoginDto, PrivacyPolicyDto, ToggleUserStatusDto } from '../dtos/admin.dto';
import { User } from '../interfaces/users.interface';
import { StockUpdateTypeDto } from '../dtos/posts.dto';
import mongoose from 'mongoose';
declare class AdminService {
    users: mongoose.Model<mongoose.Document<any, any, any>, any, any>;
    appImprovement: mongoose.Model<import("../interfaces/general.interface").AppImprovementInf & mongoose.Document<any, any, any>, {}, {}>;
    quickContact: mongoose.Model<import("../interfaces/general.interface").QuickContactInf & mongoose.Document<any, any, any>, {}, {}>;
    userSuggestion: mongoose.Model<import("../interfaces/general.interface").UserSuggestionImproveInf & mongoose.Document<any, any, any>, {}, {}>;
    privacyPolicy: mongoose.Model<import("../interfaces/general.interface").PrivacyPolicyInf & mongoose.Document<any, any, any>, {}, {}>;
    termsConditionM: mongoose.Model<import("../interfaces/general.interface").PrivacyPolicyInf & mongoose.Document<any, any, any>, {}, {}>;
    complaintM: mongoose.Model<import("../interfaces/general.interface").ComplaintsInf & mongoose.Document<any, any, any>, {}, {}>;
    adminLogin(loginDto: AdminLoginDto): Promise<{
        token: string;
    }>;
    userListing(user: User, req: any): Promise<Record<string, any>>;
    dashboardData(user: User): Promise<Record<string, any>>;
    toggleUserStatus(user: ToggleUserStatusDto): Promise<void>;
    deleteUser(id: string): Promise<void>;
    getUser(id: string): Promise<void>;
    privacyPolicyListing(): Promise<any>;
    privacyPolicyUpdate(data: PrivacyPolicyDto): Promise<void>;
    termsConditionListing(): Promise<any>;
    termsConditionUpdate(data: PrivacyPolicyDto): Promise<void>;
    appImprovementSuggestion(body: any): Promise<any>;
    quickContactListing(body: any): Promise<any>;
    complaintsListing(body: any): Promise<Record<string, any>>;
    stockTypeAdd(type: string, reqData: StockUpdateTypeDto): Promise<any>;
    stockTypeDelete(type: string, _id: string): Promise<any>;
    getArticleCategories(): Promise<any>;
    getArticles(requestData: any): Promise<any>;
    getSingleArticle(requestData: any): Promise<any>;
    deleteUserRating(requestData: any): Promise<any>;
    deleteArticle(requestData: any): Promise<any>;
    saveArticle(requestData: any, file: Express.Multer.File): Promise<any>;
    stockTypeUpload(type: string, path: string): Promise<any>;
    getAllUserTokens(userIds: []): Promise<any>;
}
export default AdminService;
