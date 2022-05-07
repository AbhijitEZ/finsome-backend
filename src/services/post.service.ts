import { PostCreateDto, StockTypeDto, UserConfigurationDto } from '@/dtos/posts.dto';
import countryModel from '@/models/countries';
import postsModel from '@/models/posts';
import awsHandler from '@utils/aws';
import fs from 'fs';
import stockTypeModel from '@/models/stock-types';
import userConfigurationModel from '@/models/user-configurations';
import { isEmpty } from 'lodash';
import { LIMIT_DEF, postAssetsFolder, SKIP_DEF, STOCK_TYPE_CONST } from '@/utils/constants';
import { fileUnSyncFromLocalStroage } from '@/utils/util';
import { postResponseFilter } from '@/utils/global';

class PostService {
  public countryObj = countryModel;
  public stockTypesObj = stockTypeModel;
  public userConfigObj = userConfigurationModel;

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

  public async postExplore(_id: string): Promise<any> {
    const postsListing = await postsModel.find({ deleted_at: undefined }).populate('user_id', ['fullname', 'email']).lean();

    const postsMapping = postsListing.map(post => postResponseFilter(post));

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
