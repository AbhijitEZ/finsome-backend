import { StockTypeDto } from '@/dtos/posts.dto';
import countryModel from '@/models/countries';
import stockTypeModel from '@/models/stock-types';
import { LIMIT_DEF, SKIP_DEF, STOCK_TYPE_CONST } from '@/utils/constants';

class PostService {
  public countryObj = countryModel;
  public stockTypesObj = stockTypeModel;

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

    const stocks = await stQb
      .limit(parseInt(reqData.limit ?? LIMIT_DEF))
      .skip(parseInt(reqData.skip ?? SKIP_DEF))
      .exec();

    const total_count = await totalCountQuery.count();

    return { stocks, total_count };
  }
}

export default PostService;
