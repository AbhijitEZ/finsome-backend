export declare class HttpException extends Error {
    status: number;
    message: string;
    data: any;
    constructor(status: number, message: string, data?: any);
}
