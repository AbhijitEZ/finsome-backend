import { PostCreateDto, PostHomeDto, StockTypeDto, UserConfigurationDto } from '@/dtos/posts.dto';
import countryModel from '@/models/countries';
import postsModel from '@/models/posts';
import awsHandler from '@utils/aws';
import fs from 'fs';
import stockTypeModel from '@/models/stock-types';
import userConfigurationModel from '@/models/user-configurations';
import isEmpty from 'lodash.isempty';
import { DEFAULT_TIMEZONE, LIMIT_DEF, postAssetsFolder, SKIP_DEF, STOCK_TYPES, STOCK_TYPE_CONST, USERS } from '@/utils/constants';
import { fileUnSyncFromLocalStroage } from '@/utils/util';
import { postResponseFilter } from '@/utils/global';
import { addDays, parseISO, toDate } from 'date-fns';
import { convertToLocalTime } from 'date-fns-timezone';

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

    const postsMapping = postsListing.map(post => postResponseFilter(post));

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
          pipeline: [{ $project: { _id: 1, fullname: 1, email: 1 } }],
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: STOCK_TYPES,
          localField: 'security_id',
          foreignField: '_id',
          as: 'security',
          pipeline: [{ $project: { _id: 1, s_type: 1, name: 1, country_code: 1 } }],
        },
      },
      { $unwind: '$security' },
      /* TODO: This needs to be updated according to views and comment */
      { $sort: { created_at: -1 } },
    ]);

    if (queryData.type) {
      postsQb.append({
        $match: {
          'security.s_type': queryData.type,
        },
      });
    }

    if (queryData.country_code) {
      postsQb.append({
        $match: {
          'security.country_code': queryData.country_code,
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
    if (queryData.stock_id) {
      postsQb.append({
        $match: {
          'security._id': queryData.stock_id,
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
        $limit: parseInt(queryData.limit ?? LIMIT_DEF),
      });
      postsQb.append({
        $skip: parseInt(queryData.skip ?? SKIP_DEF),
      });
    }

    const posts = await postsQb.exec();

    const postsMapping = posts.map(post => postResponseFilter(post));

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
    return postResponseFilter(postNew._doc);
  }
}

export default PostService;
