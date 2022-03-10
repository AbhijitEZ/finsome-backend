import { HttpException } from '@/exceptions/HttpException';
import { Response } from 'express';
import multer from 'multer';
import { APP_ERROR_MESSAGE, FILE_LIMIT } from './constants';

export const responseJSONMapper = (res: Response, statusCode: number, data: any, message?: string) => {
  res.status(statusCode).json({ data, message: message || '' });
};

// @ts-ignore
const uploadFileFilter = (req: Request, file: Express.Multer.File, cb) => {
  if (file.mimetype.match(/(image\/jpeg|image\/png|image\/heif|image\/tiff|image\/webp|image\/x-panasonic-raw)$/)) {
    cb(null, true);
  } else {
    cb(new HttpException(409, APP_ERROR_MESSAGE.incorrect_img_format), false);
  }
};

export const fileUploadCB = multer({ storage: multer.memoryStorage(), fileFilter: uploadFileFilter, limits: { fileSize: FILE_LIMIT } }).single(
  'image',
);
