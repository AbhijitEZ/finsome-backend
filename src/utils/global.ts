import { HttpException } from '@/exceptions/HttpException';
import { Response } from 'express';
import multer from 'multer';
import os from 'os';
import { User } from '@interfaces/users.interface';
import { APP_ERROR_MESSAGE, FILE_COUNT_POST, FILE_LIMIT } from './constants';
import { postAssetsGenerator, profileImageGenerator } from './util';
import { PostsInf } from '@/interfaces/general.interface';

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

// @ts-ignore
const uploadPostFileFilter = (req: Request, file: Express.Multer.File, cb) => {
  if (
    file.mimetype.match(
      /(image\/jpeg|image\/png|image\/heif|image\/tiff|image\/webp|image\/x-panasonic-raw|video\/mp4|application\/x-mpegURL|video\/quicktime|video\/MP2T|video\/3gpp|video\/x-msvideo|video\/x-ms-wmv)$/,
    )
  ) {
    cb(null, true);
  } else {
    cb(new HttpException(409, APP_ERROR_MESSAGE.incorrect_format), false);
  }
};

export const fileUploadCB = multer({ storage: multer.memoryStorage(), fileFilter: uploadFileFilter, limits: { fileSize: FILE_LIMIT } }).single(
  'image',
);

export const fileUploadCSVCB = multer({ dest: os.tmpdir(), fileFilter: uploadCSVFileFilter, limits: { fileSize: FILE_LIMIT } }).single('document');

export const fileUploadPostCB = multer({ dest: os.tmpdir(), fileFilter: uploadPostFileFilter }).fields([
  { name: 'post_images', maxCount: FILE_COUNT_POST },
  { name: 'post_vids', maxCount: FILE_COUNT_POST },
  { name: 'post_thumbs', maxCount: FILE_COUNT_POST },
]);

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

export const postResponseFilter = (postData: PostsInf): Partial<PostsInf> => {
  const post = { ...postData };

  if (post.post_images?.length) {
    post.post_images = post.post_images?.map(img => postAssetsGenerator(img));
  }
  if (post.post_thumbs?.length) {
    post.post_thumbs = post.post_thumbs?.map(img => postAssetsGenerator(img));
  }
  if (post.post_vids?.length) {
    post.post_vids = post.post_vids?.map(vid => postAssetsGenerator(vid));
  }

  return post;
};
