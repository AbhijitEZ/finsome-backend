import { HttpException } from '@/exceptions/HttpException';
import { Response } from 'express';
import multer from 'multer';
import os from 'os';
import { User } from '@interfaces/users.interface';
import { APP_ERROR_MESSAGE, DATE_FILTER_TYPE_CONST, DEFAULT_TIMEZONE, FILE_COUNT_POST, FILE_LIMIT } from './constants';
import { dateFormatter, postAssetsGenerator, profileImageGenerator } from './util';
import { CommentsInf, PostsInf } from '@/interfaces/general.interface';
import { convertToLocalTime } from 'date-fns-timezone';
import { endOfDay, format, startOfDay, sub, toDate } from 'date-fns';

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

export const postResponseMapper = (postData: PostsInf): Partial<PostsInf> => {
  const post = { ...postData };

  // @ts-ignore
  if (post?.user?.profile_photo) {
    // @ts-ignore
    post.user.profile_photo = profileImageGenerator(post.user.profile_photo);
  }

  if (post?.created_at_tz) {
    post.created_at_tz = dateFormatter(post.created_at_tz);
  }

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

export const commentResponseMapper = (comment: CommentsInf) => {
  if (comment.created_at_tz) {
    comment.created_at_tz = dateFormatter(comment.created_at_tz);
  }
  if (comment?.user?.profile_photo) {
    comment.user.profile_photo = profileImageGenerator(comment?.user?.profile_photo);
  }

  if (comment.reply) {
    comment.reply = comment.reply.map(data => ({
      ...data,
      created_at_tz: data.created_at_tz ? dateFormatter(data.created_at_tz) : undefined,
      // @ts-ignore
      reply_user: data?.reply_user ? { ...data.reply_user, profile_photo: profileImageGenerator(data.reply_user?.profile_photo) } : {},
    }));
  }

  return comment;
};

export const dateConstSwitcherHandler = (dateConst: string) => {
  let start = new Date();
  console.log(format(startOfDay(convertToLocalTime(new Date(), { timeZone: DEFAULT_TIMEZONE })), 'yyy-MM-dd'), new Date(), 'NEWWWWWWWWWWWWWWW');
  const end = endOfDay(convertToLocalTime(toDate(new Date()), { timeZone: DEFAULT_TIMEZONE }));
  switch (dateConst) {
    case DATE_FILTER_TYPE_CONST.TODAY:
      start = startOfDay(convertToLocalTime(toDate(start), { timeZone: DEFAULT_TIMEZONE }));
      break;

    case DATE_FILTER_TYPE_CONST.LAST2DAY:
      start = sub(startOfDay(convertToLocalTime(toDate(start), { timeZone: DEFAULT_TIMEZONE })), {
        days: 2,
      });
      break;

    case DATE_FILTER_TYPE_CONST.WEEK:
      start = sub(startOfDay(convertToLocalTime(toDate(start), { timeZone: DEFAULT_TIMEZONE })), {
        weeks: 1,
      });
      break;

    case DATE_FILTER_TYPE_CONST.MONTH:
      start = sub(startOfDay(convertToLocalTime(toDate(start), { timeZone: DEFAULT_TIMEZONE })), {
        months: 1,
      });
      break;

    default:
      start = startOfDay(convertToLocalTime(toDate(start), { timeZone: DEFAULT_TIMEZONE }));
      break;
  }

  return { start, end };
};
