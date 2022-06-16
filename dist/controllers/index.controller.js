"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcrypt_1 = require("bcrypt");
const users_model_1 = tslib_1.__importDefault(require("../models/users.model"));
const constants_1 = require("../utils/constants");
const HttpException_1 = require("../exceptions/HttpException");
const date_fns_1 = require("date-fns");
const user_configurations_1 = tslib_1.__importDefault(require("../models/user-configurations"));
class IndexController {
    constructor() {
        this.index = (req, res, next) => {
            try {
                res.status(200).json({ env: process.env.NODE_ENV, port: process.env.PORT });
            }
            catch (error) {
                next(error);
            }
        };
        /* Script Start */
        /* Adding default admin for the initial system */
        this.addAdminScript = async (req, res, next) => {
            try {
                const adminExists = await users_model_1.default.findOne({
                    role: constants_1.USER_ROLE.ADMIN,
                });
                if (adminExists) {
                    throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.user_already_register);
                }
                const hashedPassword = await (0, bcrypt_1.hash)('Finsom@123', 10);
                await users_model_1.default.create({
                    phone_country_code: '+91',
                    phone_number: '00000000000',
                    username: 'admin_user',
                    email: 'adminfinsom@yopmail.com',
                    password: hashedPassword,
                    term_agree_timestamp: (0, date_fns_1.toDate)(new Date()),
                    role: constants_1.USER_ROLE.ADMIN,
                });
                res.status(200).json({ email: 'adminfinsom@yopmail.com' });
            }
            catch (error) {
                next(error);
            }
        };
        /* Adding default admin for the initial system */
        this.addNotificationDefaultToAllUser = async (req, res, next) => {
            try {
                const bulk = users_model_1.default.collection.initializeOrderedBulkOp();
                bulk.find({}).update({ $set: { allow_notification: true } });
                bulk.execute();
                res.status(200).json({ message: 'Updated all the user with initial allow notification = true' });
            }
            catch (error) {
                next(error);
            }
        };
        /* Update the existing user to have default configuration  [ONE Timer] */
        this.updateDefaultConfigurationUsers = async (req, res, next) => {
            try {
                const users = users_model_1.default.aggregate([
                    {
                        $lookup: {
                            from: constants_1.USER_CONFIGURATIONS,
                            localField: '_id',
                            foreignField: 'user_id',
                            as: 'user_conf',
                        },
                    },
                ]);
                const data = await users.exec();
                data.map(user => {
                    if (!user.user_conf.length) {
                        user_configurations_1.default.create({ user_id: user._id, account_type: constants_1.ACCOUNT_TYPE_CONST.PUBLIC });
                        console.log(user._id, ' Added default config value');
                    }
                });
                res.status(200).json({ data, message: 'Updated user to have default configuration' });
            }
            catch (error) {
                next(error);
            }
        };
        /* Script End */
    }
}
exports.default = IndexController;
//# sourceMappingURL=index.controller.js.map