import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
import { APP_ERROR_MESSAGE, profileImageFolder } from './constants';
import { logger } from './logger';

class AWSHandler {
  constructor() {
    console.log('************* AWS Initialized *************');
  }

  public init() {
    AWS.config.update({
      apiVersion: 'latest',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        expired: false,
      },
      region: process.env.AWS_REGION,
    });
  }

  public deleteProfileImage(profilePhoto: string) {
    const s3 = new AWS.S3();
    s3.deleteObject({ Bucket: process.env.S3_BUCKET, Key: profileImageFolder + profilePhoto })
      .promise()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(error => {
        logger.info(APP_ERROR_MESSAGE.delete_s3_error);
      });
  }

  public async addProfileImage(file: Express.Multer.File) {
    const imageName = nanoid(12) + '_' + file.originalname;
    const s3 = new AWS.S3();

    const uploadOptions = {
      Bucket: process.env.S3_BUCKET,
      Key: profileImageFolder + imageName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    await s3
      .upload(uploadOptions)
      .promise()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(error => {
        console.log(error, 'error');
        logger.info(APP_ERROR_MESSAGE.add_s3_error);
      });
    return imageName;
  }
}

export default new AWSHandler();
