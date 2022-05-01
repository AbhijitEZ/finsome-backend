import { StockTypeDto, UserConfigurationDto } from '@/dtos/posts.dto';
import countryModel from '@/models/countries';
import stockTypeModel from '@/models/stock-types';
import userConfigurationModel from '@/models/user-configurations';
import { LIMIT_DEF, SKIP_DEF, STOCK_TYPE_CONST } from '@/utils/constants';

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
      const newConfig = await this.userConfigObj.findByIdAndUpdate(userConfig._id, { ...reqData }, { new: true });
      // @ts-ignore
      return newConfig._doc;
    }

    const newConfig = await this.userConfigObj.create({ ...reqData });

    // @ts-ignore
    return newConfig._doc;
  }
}

export default PostService;
