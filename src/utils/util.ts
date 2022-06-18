import { format, parseISO } from 'date-fns';
import fs from 'fs';
import { postAssetsFolder, profileImageFolder } from './constants';
import { logger } from './logger';

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const profileImageGenerator = (imageName: string) => {
  return imageName ? `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${profileImageFolder}${imageName}` : null;
};

export const postAssetsGenerator = (imageName: string) => {
  return imageName ? `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${postAssetsFolder}${imageName}` : null;
};

export const fileUnSyncFromLocalStroage = (path: string) => {
  fs.unlink(path, err => {
    if (err) {
      logger.error('ERROR while unlinking file from the temp ' + path);
      console.log(err);
    }

    logger.info('Removal of file from temp location in server: ' + path);
  });
};

export const dateFormatter = (date: string) => {
  return format(parseISO(date), 'yyyy-MM-dd hh:mm aaa');
};

export const listingResponseSanitize = (data: any) => {
  const total_count = data?.[0]?.totalRecords?.[0]?.total ?? 0;
  let result = data?.[0]?.result ?? [];

  result = result.map(data => {
    if (data?.user_detail?.profile_photo) {
      data.user_detail.profile_photo = profileImageGenerator(data.user_detail.profile_photo);
    }

    return {
      ...data,
    };
  });

  return {
    total_count,
    result,
  };
};
