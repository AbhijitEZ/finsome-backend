import { HttpException } from '@/exceptions/HttpException';
import { Response } from 'express';
import multer from 'multer';
import os from 'os';
import { User } from '@interfaces/users.interface';
import { APP_ERROR_MESSAGE, FILE_LIMIT } from './constants';
import { profileImageGenerator } from './util';

export const responseJSONMapper = (res: Response, statusCode: number, data: any, message?: string) => {
  res.status(statusCode).json({ data, message: message || '' });
};

// @ts-ignore
const uploadCSVFileFilter = (req: Request, file: Express.Multer.File, cb) => {
  if (file.mimetype.match(/(text\/csv)$/)) {
    cb(null, true);
  } else {
    cb(new HttpException(409, APP_ERROR_MESSAGE.incorrect_csv_format), false);
  }
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

export const fileUploadCSVCB = multer({ dest: os.tmpdir(), fileFilter: uploadCSVFileFilter, limits: { fileSize: FILE_LIMIT } }).single('document');

export const userResponseFilter = (userData: User): Partial<User> => {
  const user = { ...userData };
  delete user.password;
  delete user.term_agree_timestamp;
  delete user.updated_at;
  if (user.profile_photo) {
    user.profile_photo = profileImageGenerator(user.profile_photo);
  }
  return user;
};
