import { Response } from 'express';

export const responseJSONMapper = (res: Response, statusCode: number, data: any, message?: string) => {
  res.status(statusCode).json({ data, message: message || '' });
};
