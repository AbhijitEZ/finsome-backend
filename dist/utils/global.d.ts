/// <reference types="qs" />
import { Response } from 'express';
import { User } from '../interfaces/users.interface';
import { PostsInf } from '../interfaces/general.interface';
export declare const responseJSONMapper: (res: Response, statusCode: number, data: any, message?: string) => void;
export declare const fileUploadCB: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const fileUploadCSVCB: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const fileUploadPostCB: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const userResponseFilter: (userData: User) => Partial<User>;
export declare const postResponseFilter: (postData: PostsInf) => Partial<PostsInf>;
