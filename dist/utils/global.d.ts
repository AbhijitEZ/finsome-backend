/// <reference types="qs" />
import { Response } from 'express';
import { User } from '../interfaces/users.interface';
export declare const responseJSONMapper: (res: Response, statusCode: number, data: any, message?: string) => void;
export declare const fileUploadCB: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const fileUploadCSVCB: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const userResponseFilter: (userData: User) => Partial<User>;
