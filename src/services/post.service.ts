import countryModel from '@/models/countries';

class PostService {
  public countryObj = countryModel;

  public async countriesGetAll(): Promise<any[]> {
    const countries = await this.countryObj.find({}).lean();
    return countries;
  }
}

export default PostService;
