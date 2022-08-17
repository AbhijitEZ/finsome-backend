import {
  ArticleAddDto,
  CommentsAddDto,
  ComplaintAddDto,
  IdPaginationDto,
  LikePostDto,
  PostAssetDeleteDto,
  PostCreateDto,
  PostHomeDto,
  StockSearchDto,
  StockTypeDto,
  UserConfigurationDto,
} from '@/dtos/posts.dto';
import countryModel from '@/models/countries';
import firecustom from '@utils/firecustom';
import postsModel from '@/models/posts';
import awsHandler from '@utils/aws';
import fs from 'fs';
import stockTypeModel from '@/models/stock-types';
import userConfigurationModel from '@/models/user-configurations';
import isEmpty from 'lodash.isempty';
import mongoose from 'mongoose';
import {
  ACCOUNT_TYPE_CONST,
  APP_ERROR_MESSAGE,
  COMMENTS,
  COUNTRIES,
  DEFAULT_TIMEZONE,
  LIKES,
  LIMIT_DEF,
  NOTIFICATION_TYPE_CONST,
  postAssetsFolder,
  POSTS,
  POST_STOCKS,
  SKIP_DEF,
  STOCK_TYPES,
  STOCK_TYPE_CONST,
  USERS,
} from '@/utils/constants';
import { fileUnSyncFromLocalStroage, listingResponseSanitize, profileImageGenerator } from '@/utils/util';
import { commentResponseMapper, dateConstSwitcherHandler, postResponseMapper } from '@/utils/global';
import postStockModel from '@/models/post-stocks';
import commentsModel from '@/models/comments';
import { Mongoose, Types } from 'mongoose';
import likesModel from '@/models/likes';
import { HttpException } from '@/exceptions/HttpException';
import complaintModel from '@/models/complaints';
import userFollowerModel from '@/models/user-followers';
import notificationModel from '@/models/notifications';
import articleCatModel from '@/models/article-categories';
import deviceTokenModel from '@/models/device-tokens';
import articleModel from '@/models/articles';
import notificationSubscriptionModel from '@/models/notification.subscription';
import userModel from '@/models/users.model';

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
    comments: 1,
    total_comments: 1,
    deleted_at: 1,
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
    let query: any = { s_type: reqData.type };
    // let stQb = this.stockTypesObj.find({
    //   s_type: reqData.type,
    // });

    if (reqData.type === STOCK_TYPE_CONST.EQUITY && reqData.country_code) {
      query['$and'] = [{ country_code: reqData.country_code }];
      // stQb = stQb.and([{ country_code: reqData.country_code }]);
    }

    if (reqData.search) {
      query['$and'] = [{ $or: [{ name: { $regex: `.*${reqData.search}.*`, $options: 'i' } }, { code: reqData.search }] }];
      // stQb = stQb.and([{ $or: [{ name: {find $regex: `.*${reqData.search}.*`, $options: 'i' } }, { code: reqData.search }] }]);
    }

    if (reqData.has_all_data) {
      let model: any = stockTypeModel;
      let output: any = await model.paginate(query, {
        page: reqData.page,
        limit: reqData.limit,
      });
      return output;
    } else {
      let stocks = await this.stockTypesObj
        .find(query)
        .limit(parseInt(reqData.limit ?? LIMIT_DEF))
        .skip(parseInt(reqData.skip ?? SKIP_DEF))
        .exec();
      const total_count = await this.stockTypesObj.countDocuments(query);
      return { stocks, total_count };
    }
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

  public async getArticles(requestData: any): Promise<any> {
    let model: any = articleModel;
    let searchRegex = new RegExp(requestData.search, 'i');
    let query = { title: searchRegex };
    if (requestData.categoryId != null && requestData.categoryId != '') {
      query['category'] = requestData.categoryId;
    }
    let data = await model.find(query).populate('category').sort({ sequence: 1 }).skip(requestData.skip).limit(requestData.limit);
    return data;
  }

  public async postHome(_id: string, queryData: PostHomeDto): Promise<any> {
    const usersFollower = await userFollowerModel
      .find({
        follower_id: _id,
        deleted_at: {
          $eq: null,
        },
        accepted: true,
      })
      .lean();

    const allUserPostDisplayIds = [_id, ...(usersFollower.length ? usersFollower.map(data => data.user_id) : [])];

    const userMatch: any = {
      deleted_at: { $eq: null },
    };

    if (queryData?.has_all_data) {
      userMatch['user_id'] = { $ne: null };
      delete userMatch.deleted_at;
    } else if (queryData?.user_id) {
      userMatch['user_id'] = new Types.ObjectId(queryData.user_id);
    } else {
      if (queryData.is_explore == null || queryData.is_explore == false) {
        userMatch['user_id'] = {
          $in: allUserPostDisplayIds,
        };
      } else {
        let query: any = {
          user_id: { $nin: [mongoose.Types.ObjectId(_id)] },
          account_type: ACCOUNT_TYPE_CONST.PUBLIC,
        };
        let userIds: any = await userConfigurationModel.find(query).select('user_id').lean();
        userIds = userIds.map(e => mongoose.Types.ObjectId(e.user_id));
        userMatch['user_id'] = { $in: userIds };
      }
    }

    const postsQb = this.postsObj.aggregate([
      {
        $project: this.postResObj,
      },
      {
        $match: userMatch,
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
          pipeline: [
            { $project: { _id: 1, s_type: 1, name: 1, country_code: 1, country_data: 1 } },
            {
              $lookup: {
                from: COUNTRIES,
                localField: 'country_code',
                foreignField: 'code',
                as: 'country_data',
              },
            },
            {
              $unwind: {
                path: '$country_data',
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
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
              $project: {
                user_id: 1,
              },
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
        $lookup: {
          from: COMMENTS,
          localField: '_id',
          foreignField: 'post_id',
          as: 'comments',
          pipeline: [
            {
              $project: {
                user_id: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          total_comments: { $size: '$comments' },
        },
      },
      {
        $lookup: {
          from: LIKES,
          localField: '_id',
          foreignField: 'post_id',
          as: 'likes_status',
          pipeline: [
            {
              $match: {
                user_id: queryData?.has_all_data ? { $ne: null } : new Types.ObjectId(_id),
              },
            },
            {
              $addFields: {
                status: {
                  $eq: ['$user_id', _id],
                },
              },
            },
            {
              $project: {
                _id: -1,
                status: 1,
              },
            },
          ],
        },
      },
      {
        $unset: ['likes', 'comments', 'post_stock'],
      },
      /* TODO: This needs to be updated according to views and comment */
      { $sort: { created_at: -1 } },
    ]);

    if (!queryData?.has_all_data) {
      postsQb.append({
        $unwind: {
          path: '$likes_status',
          preserveNullAndEmptyArrays: true,
        },
      });
    }

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
          is_recommended: queryData.is_recommended === 'true',
        },
      });
    }
    if (queryData.analysis_type) {
      const analysisTypes = queryData.analysis_type.split(',');
      postsQb.append({
        $match: {
          analysis_type: {
            $in: analysisTypes,
          },
        },
      });
    }
    if (queryData.trade_type) {
      const tradeTypes = queryData.trade_type.split(',');

      postsQb.append({
        $match: {
          trade_type: {
            $in: tradeTypes,
          },
        },
      });
    }

    if (queryData.stock_ids) {
      const stockIds = queryData.stock_ids.split(',');

      postsQb.append({
        $match: {
          'security._id': {
            $in: stockIds.map(id => new Types.ObjectId(id)),
          },
        },
      });
    }

    /* NOTE: Require testing for the different timezone */
    if (queryData.date) {
      const { start, end } = dateConstSwitcherHandler(queryData.date);
      console.log(start, end, 'start, end ');
      postsQb.append({
        $match: {
          created_at: {
            $gte: start,
            $lte: end,
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

    if (queryData.has_all_data) {
      let searchRegex: any = new RegExp(queryData.search, 'i');
      postsQb.append({
        $match: {
          $or: [
            { caption: searchRegex },
            { stock_type: searchRegex },
            { 'user.fullname': searchRegex },
            { 'security.name': searchRegex },
            { 'security.country_data.name': searchRegex },
          ],
        },
      });
      let model: any = postsModel;
      let posts = await model.aggregatePaginate(postsQb, {
        page: queryData.skip,
        limit: queryData.limit,
      });
      return posts;
    } else {
      const posts = await postsQb.exec();
      const total_count = posts?.[0]?.totalRecords?.[0]?.total ?? 0;
      const result = posts?.[0]?.result ?? [];
      const postsMapping = result.map(post => postResponseMapper(post));
      return { result: postsMapping, total_count };
    }
  }

  public async postCreate(
    _id: string,
    fullname: string,
    profilePhoto: string,
    reqData: PostCreateDto,
    files?: Record<string, Array<Express.Multer.File>>,
    postId?: String,
  ): Promise<any> {
    // WAYROUND PATCH
    const payloadNew: any = { ...reqData, is_recommended: reqData.is_recommended === 'true' ? true : false };
    let post_images = [],
      post_thumbs = [],
      post_vids = [];
    let postPrevData = null;

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

    if (postId) {
      postPrevData = await postsModel.findById(postId);
    }

    payloadNew.post_images = postPrevData ? [].concat(postPrevData?.post_images ?? [], post_images) : post_images;
    payloadNew.post_thumbs = postPrevData ? [].concat(postPrevData?.post_thumbs ?? [], post_thumbs) : post_thumbs;
    payloadNew.post_vids = postPrevData ? [].concat(postPrevData?.post_vids ?? [], post_vids) : post_vids;

    let postData: any = {};
    if (postId) {
      postData = await postsModel.findByIdAndUpdate(postId, { user_id: _id, ...payloadNew }, { new: true });
    } else {
      postData = await postsModel.create({ user_id: _id, ...payloadNew });
    }

    if (reqData.post_security_ids?.length) {
      if (postId) {
        // @ts-ignore
        const postStockDeletedCount = await postStockModel.deleteMany({
          post_id: postId,
        });

        console.log('DELETE post stock on update: ', postStockDeletedCount?.deletedCount || 0);
      }
      const postSecurityIds = reqData.post_security_ids.map(security => ({ post_id: postData._id, stock_id: security }));
      await postStockModel.insertMany(postSecurityIds);
    }

    this.sendNotificationToSubscripedUsers(_id, postData._id, fullname, profilePhoto);

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

    const data = await this.singlePostAggreData(String(postData._id), _id);
    return data;
  }

  public async postDetail(userId: string, postId: string): Promise<any> {
    const data = await this.singlePostAggreData(postId, userId);
    return data;
  }

  public async postDelete(userId: string, postId: string): Promise<any> {
    const postData = await postsModel
      .findOne({
        _id: new Types.ObjectId(postId),
      })
      .lean();

    if (!postData) {
      throw new HttpException(400, APP_ERROR_MESSAGE.post_not_exists);
    }

    await postsModel.findByIdAndUpdate(postData._id, {
      deleted_at: new Date(),
    });

    // @ts-ignore
    return postData;
  }

  public async postDeleteAssets(userId: string, postId: string, reqData: PostAssetDeleteDto): Promise<any> {
    const post = await postsModel.findOne({
      _id: { $eq: postId },
    });

    if (!post) {
      throw new HttpException(400, APP_ERROR_MESSAGE.post_not_exists);
    }

    const nameArr = reqData.names.split(',');

    const post_images = post.post_images.filter(asset => {
      if (nameArr.includes(asset)) {
        awsHandler.deletePostAsset(asset);
        return false;
      }
      return true;
    });

    const post_thumbs = post.post_thumbs.filter(asset => {
      if (nameArr.includes(asset)) {
        awsHandler.deletePostAsset(asset);
        return false;
      }
      return true;
    });

    const post_vids = post.post_vids.filter(asset => {
      if (nameArr.includes(asset)) {
        awsHandler.deletePostAsset(asset);
        return false;
      }
      return true;
    });

    await postsModel.findByIdAndUpdate(postId, { post_images, post_vids, post_thumbs });

    const data = await this.singlePostAggreData(postId, userId);

    return data;
  }

  public async stockSearch(userId: string, reqData: StockSearchDto): Promise<any> {
    let stockData = this.stockTypesObj.aggregate([
      {
        $match: {
          $or: [
            {
              name: { $regex: reqData.search, $options: 'i' },
            },
            {
              code: { $regex: reqData.search, $options: 'i' },
            },
          ],
        },
      },
      {
        $sort: { created_at: -1 },
      },
      {
        $facet: {
          totalRecords: [
            {
              $count: 'total',
            },
          ],
          result: [
            {
              $skip: parseInt(reqData.skip ?? SKIP_DEF),
            },
            {
              $limit: parseInt(reqData.limit ?? LIMIT_DEF),
            },
          ],
        },
      },
    ]);

    stockData = await stockData.exec();
    const data = listingResponseSanitize(stockData);
    return data;
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
          deleted_at: { $eq: null },
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
            {
              $unwind: {
                path: '$reply_user',
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      {
        $unset: ['user_id', 'post_id'],
      },
      {
        $sort: {
          created_at: -1,
        },
      },
    ]);

    if (!reqData.has_all_data) {
      commentQB.append({
        $facet: {
          totalRecords: [
            {
              $count: 'total',
            },
          ],
          result: [
            {
              $skip: parseInt(reqData.skip ?? SKIP_DEF),
            },
            {
              $limit: parseInt(reqData.limit ?? LIMIT_DEF),
            },
          ],
        },
      });
    }

    if (reqData.has_all_data) {
      commentQB.append({
        $facet: {
          totalRecords: [
            {
              $count: 'total',
            },
          ],
          result: [],
        },
      });
    }

    let commentsData = await commentQB.exec();

    const total_count = commentsData?.[0]?.totalRecords?.[0]?.total ?? 0;
    const result = commentsData?.[0]?.result ?? [];
    commentsData = result?.map(comm => commentResponseMapper(comm)) ?? [];

    return { result: commentsData, total_count };
  }

  public async commentAdd(fullname: string, profile_photo: string, userId: string, reqData: CommentsAddDto): Promise<any> {
    const newComment = await commentsModel.create({
      user_id: userId,
      post_id: reqData.post_id,
      message: reqData.message,
      parent_id: reqData.parent_id ?? null,
    });

    const postDetail = await this.postsObj.findOne({
      _id: reqData.post_id,
    });

    if (postDetail.user_id.toString() != userId.toString()) {
      const message = `${fullname || 'User'} has added a comment to one your post`;
      const metadata = {
        post_id: postDetail._id,
        user_id: postDetail.user_id,
        profile_photo: profileImageGenerator(profile_photo),
      };

      await notificationModel.create({
        user_id: postDetail.user_id,
        type: NOTIFICATION_TYPE_CONST.COMMENT,
        message: message,
        meta_data: metadata,
      });

      this.sendNotificationWrapper(postDetail.user_id, {
        notification: {
          title: message,
        },
        data: {
          payload: JSON.stringify({ ...metadata, type: NOTIFICATION_TYPE_CONST.COMMENT }),
        },
      });
    }

    const commentCounts = await commentsModel.countDocuments({
      post_id: reqData.post_id,
      parent_id: {
        $eq: null,
      },
    });

    if (reqData.parent_id) {
      const commentQB = commentsModel.aggregate([
        {
          $project: this.commentResObj,
        },
        {
          $match: {
            _id: new Types.ObjectId(reqData.parent_id),
            post_id: new Types.ObjectId(reqData.post_id),
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
              {
                $unwind: {
                  path: '$reply_user',
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
          },
        },
        {
          $unset: ['user_id', 'post_id'],
        },
        {
          $sort: {
            created_at: -1,
          },
        },
      ]);

      const commentsData = await commentQB.exec();

      return {
        total_count: commentCounts,
        // @ts-ignore
        result: [commentResponseMapper(commentsData?.[0])],
      };
    }

    const commentQB = commentsModel.aggregate([
      {
        $project: this.commentResObj,
      },
      {
        $match: {
          _id: new Types.ObjectId(newComment._id),
          post_id: new Types.ObjectId(reqData.post_id),
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
        $unset: ['user_id', 'post_id'],
      },
      {
        $sort: {
          created_at: -1,
        },
      },
    ]);

    const commentsData = await commentQB.exec();

    // @ts-ignore
    return {
      total_count: commentCounts,
      // @ts-ignore
      result: [commentResponseMapper(commentsData?.[0])],
    };
  }

  // TODO: Need to remove the replies if the parent is removed
  public async commentDelete(userId: string, postId: string, commentId: string): Promise<any> {
    const commentCheck = await commentsModel.findOne({
      _id: new Types.ObjectId(commentId),
    });

    if (!commentCheck) {
      throw new HttpException(403, APP_ERROR_MESSAGE.user_not_auth);
    }

    await commentsModel.deleteOne({
      _id: new Types.ObjectId(commentId),
    });

    const commentCounts = await commentsModel.countDocuments({
      post_id: postId,
      parent_id: {
        $eq: null,
      },
    });

    // @ts-ignore
    return commentCounts;
  }

  public async postLikeUpdate(userId: string, fullname: string, profile_photo: string, reqData: LikePostDto): Promise<any> {
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
      await this.notificationUpdate({ reqData, userId, fullname, profile_photo });
    } else {
      await likesModel.deleteOne({ user_id: userId, post_id: reqData.post_id });
    }

    let likeQb = likesModel.aggregate([
      {
        $match: {
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

  public async complaintAdd(userId: string, reqData: ComplaintAddDto): Promise<any> {
    if (!reqData.post_complain_id && !reqData.user_complain_id) {
      throw new HttpException(400, APP_ERROR_MESSAGE.post_complain_usr_complain_exists);
    }

    const newComlaint = await complaintModel.create({
      post_complain_id: reqData.post_complain_id ?? null,
      user_complain_id: reqData.user_complain_id ?? null,
      user_id: userId,
      reason: reqData.reason,
      description: reqData.description ?? null,
    });

    // @ts-ignore
    return newComlaint._doc;
  }

  public async articleCatListing(): Promise<any> {
    const articleCategories = await articleCatModel
      .find({
        deleted_at: { $eq: null },
      })
      .sort({ sequence: 1 })
      .lean();

    // @ts-ignore
    return articleCategories;
  }

  public async articleAdd(userId: string, reqData: ArticleAddDto): Promise<any> {
    const newArticle = await articleCatModel.create({
      user_id: new Types.ObjectId(userId),
      ...reqData,
    });

    // @ts-ignore
    return newArticle;
  }

  protected async singlePostAggreData(postId: string, userId: string): Promise<any> {
    const postsQb = this.postsObj.aggregate([
      {
        $project: this.postResObj,
      },
      { $match: { $expr: { $eq: ['$_id', { $toObjectId: new Types.ObjectId(postId) }] } } },
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
          pipeline: [
            { $project: { _id: 1, s_type: 1, name: 1, country_code: 1, country_data: 1 } },
            {
              $lookup: {
                from: COUNTRIES,
                localField: 'country_code',
                foreignField: 'code',
                as: 'country_data',
              },
            },
            {
              $unwind: {
                path: '$country_data',
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
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
              $project: {
                user_id: 1,
              },
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
        $lookup: {
          from: COMMENTS,
          localField: '_id',
          foreignField: 'post_id',
          as: 'comments',
          pipeline: [
            {
              $project: {
                user_id: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          total_comments: { $size: '$comments' },
        },
      },
      {
        $lookup: {
          from: LIKES,
          localField: '_id',
          foreignField: 'post_id',
          as: 'likes_status',
          pipeline: [
            {
              $match: {
                user_id: new Types.ObjectId(userId),
              },
            },
            {
              $addFields: {
                status: {
                  $eq: ['$user_id', userId],
                },
              },
            },
            {
              $project: {
                _id: -1,
                status: 1,
              },
            },
          ],
        },
      },
      {
        $unset: ['likes', 'comments', 'post_stock'],
      },
      /* TODO: This needs to be updated according to views and comment */
      { $sort: { created_at: -1 } },
    ]);

    const post = await postsQb.exec();

    if (!post.length) {
      throw new HttpException(400, APP_ERROR_MESSAGE.post_not_exists);
    }

    // @ts-ignore
    return postResponseMapper(post?.[0] ?? {});
  }

  private async notificationUpdate({ reqData, fullname, userId, profile_photo }: any) {
    const userPostData = await postsModel.findOne({
      _id: new Types.ObjectId(reqData.post_id),
    });

    if (userPostData != null && mongoose.isValidObjectId(userId) && mongoose.isValidObjectId(userPostData?.user_id)) {
      if (userId.toString() != userPostData?.user_id.toString()) {
        const message = `${fullname || 'User'} has like your post`;
        const meta_data = {
          post_id: reqData.post_id,
          user_id: userId,
          profile_photo: profileImageGenerator(profile_photo),
        };
        /* TODO: Need to add notification wrapper that takes care of all the stuff */
        notificationModel.create({
          user_id: userPostData.user_id,
          type: NOTIFICATION_TYPE_CONST.USER_LIKED,
          message: message,
          meta_data,
        });

        this.sendNotificationWrapper(userPostData.user_id, {
          notification: {
            title: message,
          },
          data: {
            payload: JSON.stringify({ ...meta_data, type: NOTIFICATION_TYPE_CONST.USER_LIKED }),
          },
        });
      }
    }
  }

  private sendNotificationWrapper = async (userId: string, messagePayload: any) => {
    const userData = await userModel.find({ _id: userId }).select('allow_notification').lean();
    if (userData.length > 0) {
      if (userData[0].allow_notification == true) {
        const deviceTokens = await deviceTokenModel.find({
          user_id: userId,
          revoked: false,
        });

        if (deviceTokens?.length) {
          deviceTokens.forEach(data => {
            firecustom.sendNotification(data.device_token, messagePayload);
          });
        }
      }
    }
  };

  private sendNotificationToSubscripedUsers = async (userId: string, postId: string, fullname: string, profilePhoto?: string) => {
    const subscripedUsers = await notificationSubscriptionModel.find({
      user_id: userId,
    });

    subscripedUsers.map(async data => {
      const deviceTokens = await deviceTokenModel.find({
        user_id: data.subscriber_id,
        revoked: false,
      });

      if (deviceTokens?.length) {
        const message = `${fullname || 'User'} has added a post`;
        const metadata = {
          post_id: postId,
          user_id: userId,
          profile_photo: profileImageGenerator(profilePhoto),
        };

        deviceTokens.forEach(data => {
          firecustom.sendNotification(data.device_token, {
            notification: {
              title: message,
            },
            data: {
              payload: JSON.stringify({ ...metadata, type: NOTIFICATION_TYPE_CONST.POST }),
            },
          });
        });
      }
    });
  };

  public async getArticleCategories(): Promise<any> {
    let data = await articleCatModel
      .find({
        deleted_at: { $eq: null },
      })
      .sort({ sequence: -1 })
      .lean();
    return data;
  }
}

export default PostService;
