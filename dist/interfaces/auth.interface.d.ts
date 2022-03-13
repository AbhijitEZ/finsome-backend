import { Request } from 'express';
import { User } from './users.interface';
export interface DataStoredInToken {
    _id: string;
    role: string;
}
export interface TokenData {
    token: string;
    expires_in: number;
}
export interface RequestWithUser extends Request {
    user: User;
}
