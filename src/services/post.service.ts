import { CommentsAddDto, IdPaginationDto, LikePostDto, PostCreateDto, PostHomeDto, StockTypeDto, UserConfigurationDto } from '@/dtos/posts.dto';
import countryModel from '@/models/countries';
import postsModel from '@/models/posts';
import awsHandler from '@utils/aws';
import fs from 'fs';
import stockTypeModel from '@/models/stock-types';
import userConfigurationModel from '@/models/user-configurations';
import isEmpty from 'lodash.isempty';
import {
  APP_ERROR_MESSAGE,
  COMMENTS,
  DEFAULT_TIMEZONE,
  LIKES,
  LIMIT_DEF,
  postAssetsFolder,
  POSTS,
  POST_STOCKS,
  SKIP_DEF,
  STOCK_TYPES,
  STOCK_TYPE_CONST,
  USERS,
} from '@/utils/constants';
import { fileUnSyncFromLocalStroage } from '@/utils/util';
import { commentResponseMapper, postResponseMapper } from '@/utils/global';
import { addDays, parseISO, toDate } from 'date-fns';
import { convertToLocalTime } from 'date-fns-timezone';
import postStockModel from '@/models/post-stocks';
import commentsModel from '@/models/comments';
import { Types } from 'mongoose';
import likesModel from '@/models/likes';
import { HttpException } from '@/exceptions/HttpException';

class PostService {
  public countryObj = countryModel;
  public stockTypesObj = stockTypeModel;
  public userConfigObj = userConfigurationModel;
  public postsObj = postsModel;
  public postResObj = {
    _id: 1,
    is_recommended: 1,
    post_images: 1,
    post_thumbs: 1,
    post_vids: 1,
    user_id: 1,
    stock_type: 1,
    post_stock: 1,
    analysis_type: 1,
    trade_type: 1,
    security_id: 1,
    stock_recommended_type: 1,
    buy_recommend_amount: 1,
    sell_recommend_amount: 1,
    caption: 1,
    created_at: 1,
    updated_at: 1,
    created_at_tz: { $dateToString: { date: '$created_at', timezone: DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
    user: 1,
    security: 1,
    likes: 1,
    total_likes: 1,
  };
  public commentResObj = {
    _id: 1,
    parent_id: 1,
    message: 1,
    created_at: 1,
    updated_at: 1,
    user_id: 1,
    post_id: 1,
    created_at_tz: { $dateToString: { date: '$created_at', timezone: DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
    user: 1,
    post: 1,
    reply: 1,
  };

  public async countriesGetAll(): Promise<any[]> {
    const countries = await this.countryObj.find({}).lean();
    return countries;
  }

  public async stockTypesShares(reqData: StockTypeDto): Promise<any> {
    let stQb = this.stockTypesObj.find({
      s_type: reqData.type,
    });

    if (reqData.type === STOCK_TYPE_CONST.EQUITY && reqData.country_code) {
      stQb = stQb.and([{ country_code: reqData.country_code }]);
    }

    if (reqData.search) {
      stQb = stQb.and([{ $or: [{ name: { $regex: `.*${reqData.search}.*`, $options: 'i' } }, { code: reqData.search }] }]);
    }

    const QueryCloned = stQb.toConstructor();
    const totalCountQuery = new QueryCloned();

    const stocks = reqData.has_all_data
      ? await stQb.exec()
      : await stQb
          .limit(parseInt(reqData.limit ?? LIMIT_DEF))
          .skip(parseInt(reqData.skip ?? SKIP_DEF))
          .exec();

    const total_count = await totalCountQuery.count();

    return { stocks, total_count };
  }

  public async userConfigListing(_id: string): Promise<any> {
    const userConfig = await this.userConfigObj.findOne({ user_id: _id }).lean();

    return userConfig || {};
  }

  public async userConfigUpdate(_id: string, reqData: UserConfigurationDto): Promise<any> {
    const userConfig = await this.userConfigObj.findOne({ user_id: _id }).lean();

    if (userConfig) {
      const newConfig = await this.userConfigObj.findByIdAndUpdate(userConfig._id, { user_id: _id, ...reqData }, { new: true });
      // @ts-ignore
      return newConfig._doc;
    }

    const newConfig = await this.userConfigObj.create({ ...reqData, user_id: _id });

    // @ts-ignore
    return newConfig._doc;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async postExplore(_id: string): Promise<any> {
    const postsListing = await postsModel.find({ deleted_at: undefined }).populate('user_id', ['fullname', 'email']).lean();

    const postsMapping = postsListing.map(post => postResponseMapper(post));

    return postsMapping;
  }

  public async postHome(_id: string, queryData: PostHomeDto): Promise<any> {
    const postsQb = this.postsObj.aggregate([
      {
        $project: this.postResObj,
      },
      {
        $match: {
          /* For getting all the data, would be used for admin panel */
          user_id: queryData?.has_all_data ? { $ne: null } : _id,
          deleted_at: undefined,
        },
      },
      {
        $lookup: {
          from: USERS,
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
          pipeline: [{ $project: { _id: 1, fullname: 1, email: 1, profile_photo: 1 } }],
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: POST_STOCKS,
          localField: '_id',
          foreignField: 'post_id',
          as: 'post_stock',
        },
      },
      {
        $lookup: {
          from: STOCK_TYPES,
          localField: 'post_stock.stock_id',
          foreignField: '_id',
          as: 'security',
          pipeline: [{ $project: { _id: 1, s_type: 1, name: 1, country_code: 1 } }],
        },
      },
      {
        $lookup: {
          from: LIKES,
          localField: '_id',
          foreignField: 'post_id',
          as: 'likes',
          pipeline: [
            {
              $count: 'total_count',
            },
          ],
        },
      },
      {
        $addFields: {
          total_likes: { $size: '$likes' },
        },
      },
      {
        $unset: ['likes', 'post_stock'],
      },
      /* TODO: This needs to be updated according to views and comment */
      { $sort: { created_at: -1, total_likes: -1 } },
    ]);

    if (queryData.type) {
      postsQb.append({
        $match: {
          stock_type: queryData.type,
        },
      });
    }

    if (queryData.country_code) {
      postsQb.append({
        $match: {
          security: {
            $elemMatch: {
              country_code: queryData.country_code,
            },
          },
        },
      });
    }
    if (queryData.is_recommended) {
      postsQb.append({
        $match: {
          is_recommended: true,
        },
      });
    }
    if (queryData.analysis_type) {
      postsQb.append({
        $match: {
          analysis_type: queryData.analysis_type,
        },
      });
    }
    if (queryData.trade_type) {
      postsQb.append({
        $match: {
          trade_type: queryData.trade_type,
        },
      });
    }
    if (queryData.stock_ids) {
      postsQb.append({
        $match: {
          security: {
            $elemMatch: {
              stock_id: {
                $in: queryData.stock_ids,
              },
            },
          },
        },
      });
    }

    /* NOTE: Require testing for the different timezone */
    if (queryData.date) {
      const date = queryData.date + 'T00:00:00.Z';
      postsQb.append({
        $match: {
          created_at: {
            $gte: convertToLocalTime(toDate(parseISO(date)), { timeZone: DEFAULT_TIMEZONE }),
            $lt: addDays(convertToLocalTime(toDate(parseISO(date)), { timeZone: DEFAULT_TIMEZONE }), 1),
          },
        },
      });
    }

    if (!queryData.has_all_data) {
      postsQb.append({
        $facet: {
          totalRecords: [
            {
              $count: 'total',
            },
          ],
          result: [
            {
              $skip: parseInt(queryData.skip ?? SKIP_DEF),
            },
            {
              $limit: parseInt(queryData.limit ?? LIMIT_DEF),
            },
          ],
        },
      });
    }

    const posts = await postsQb.exec();

    const postsMapping = posts.map(post => postResponseMapper(post));

    return postsMapping;
  }

  public async postCreate(_id: string, reqData: PostCreateDto, files?: Record<string, Array<Express.Multer.File>>): Promise<any> {
    // WAYROUND PATCH
    const payloadNew: any = { ...reqData, is_recommended: reqData.is_recommended === 'true' ? true : false };
    let post_images = [],
      post_thumbs = [],
      post_vids = [];

    /* At present everything is synchronous */
    if (!isEmpty(files)) {
      if (files?.post_images?.length) {
        post_images = await Promise.all(
          files?.post_images?.map(async file => {
            const fileContent = await fs.readFileSync(file.path);
            const fileData = await awsHandler.addAssets(file, postAssetsFolder, fileContent);
            return fileData;
          }),
        );
      }

      if (files?.post_thumbs?.length) {
        post_thumbs = await Promise.all(
          files?.post_thumbs?.map(async file => {
            const fileContent = await fs.readFileSync(file.path);
            const fileData = await awsHandler.addAssets(file, postAssetsFolder, fileContent);
            return fileData;
          }),
        );
      }

      if (files?.post_vids?.length) {
        post_vids = await Promise.all(
          files?.post_vids?.map(async file => {
            const fileContent = await fs.readFileSync(file.path);
            const fileData = await awsHandler.addAssets(file, postAssetsFolder, fileContent);
            return fileData;
          }),
        );
      }
    }

    payloadNew.post_images = post_images;
    payloadNew.post_thumbs = post_thumbs;
    payloadNew.post_vids = post_vids;

    const postNew = await postsModel.create({ user_id: _id, ...payloadNew });

    if (reqData.post_security_ids?.length) {
      const postSecurityIds = reqData.post_security_ids.map(security => ({ post_id: postNew._id, stock_id: security }));
      await postStockModel.insertMany(postSecurityIds);
    }

    if (!isEmpty(files)) {
      files?.post_images?.map(file => {
        fileUnSyncFromLocalStroage(file.path);
      });
      files?.post_vids?.map(file => {
        fileUnSyncFromLocalStroage(file.path);
      });
      files?.post_thumbs?.map(file => {
        fileUnSyncFromLocalStroage(file.path);
      });
    }

    // @ts-ignore
    return postResponseMapper(postNew._doc);
  }

  public async commentListing(userId: string, reqData: IdPaginationDto): Promise<any> {
    const commentQB = commentsModel.aggregate([
      {
        $project: this.commentResObj,
      },
      {
        $match: {
          post_id: new Types.ObjectId(reqData.id),
          parent_id: { $eq: null },
          deleted_at: undefined,
        },
      },
      {
        $lookup: {
          from: USERS,
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
          pipeline: [{ $project: { _id: 1, fullname: 1, email: 1, profile_photo: 1 } }],
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: POSTS,
          localField: 'post_id',
          foreignField: '_id',
          as: 'post',
          pipeline: [{ $project: { _id: 1 } }],
        },
      },
      { $unwind: '$post' },
      {
        $lookup: {
          from: COMMENTS,
          localField: '_id',
          foreignField: 'parent_id',
          as: 'reply',
          pipeline: [
            {
              $project: {
                _id: 1,
                post_id: 1,
                user_id: 1,
                message: 1,
                created_at: 1,
                created_at_tz: { $dateToString: { date: '$created_at', timezone: DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
              },
            },
            {
              $lookup: {
                from: USERS,
                localField: 'user_id',
                foreignField: '_id',
                as: 'reply_user',
                pipeline: [{ $project: { _id: 1, fullname: 1, email: 1, profile_photo: 1 } }],
              },
            },
            { $unwind: '$reply_user' },
          ],
        },
      },
      {
        $unset: ['user_id', 'post_id'],
      },
    ]);

    if (!reqData.has_all_data) {
      commentQB.append({
        $limit: parseInt(reqData.limit ?? LIMIT_DEF),
      });
      commentQB.append({
        $skip: parseInt(reqData.skip ?? SKIP_DEF),
      });
    }

    let commentsData = await commentQB.exec();
    commentsData = commentsData?.map(comm => commentResponseMapper(comm)) ?? [];

    return commentsData;
  }

  public async commentAdd(userId: string, reqData: CommentsAddDto): Promise<any> {
    const newComment = await commentsModel.create({
      user_id: userId,
      post_id: reqData.post_id,
      message: reqData.message,
      parent_id: reqData.parent_id ?? null,
    });

    // @ts-ignore
    return newComment._doc;
  }

  public async postLikeUpdate(userId: string, reqData: LikePostDto): Promise<any> {
    const likeExistsForUser = await likesModel.findOne({
      user_id: userId,
      post_id: reqData.post_id,
    });

    if (reqData.like && likeExistsForUser) {
      throw new HttpException(400, APP_ERROR_MESSAGE.post_like_exists);
    }

    if (!reqData.like && !likeExistsForUser) {
      throw new HttpException(400, APP_ERROR_MESSAGE.post_not_like_exists);
    }

    if (reqData.like) {
      await likesModel.create({ user_id: userId, post_id: reqData.post_id });
    } else {
      await likesModel.deleteOne({ user_id: userId, post_id: reqData.post_id });
    }

    let likeQb = likesModel.aggregate([
      {
        $match: {
          user_id: {
            $eq: new Types.ObjectId(userId),
          },
          post_id: {
            $eq: new Types.ObjectId(reqData.post_id),
          },
        },
      },
      {
        $count: 'total_count',
      },
    ]);

    likeQb = await likeQb.exec();
    return likeQb?.[0]?.total_count ?? 0;
  }
}

export default PostService;
