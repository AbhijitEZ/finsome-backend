"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const countries_1 = tslib_1.__importDefault(require("../models/countries"));
class PostService {
    constructor() {
        this.countryObj = countries_1.default;
    }
    async countriesGetAll() {
        const countries = await this.countryObj.find({}).lean();
        return countries;
    }
}
exports.default = PostService;
//# sourceMappingURL=post.service.js.map