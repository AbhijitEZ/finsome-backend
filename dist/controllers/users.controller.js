"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_service_1 = tslib_1.__importDefault(require("../services/users.service"));
class UsersController {
    constructor() {
        this.userService = new users_service_1.default();
        this.getUsers = async (req, res, next) => {
            try {
                const findAllUsersData = await this.userService.findAllUser();
                res.status(200).json({ data: findAllUsersData, message: 'findAll' });
            }
            catch (error) {
                next(error);
            }
        };
        this.getUserById = async (req, res, next) => {
            try {
                const userId = req.params.id;
                const findOneUserData = await this.userService.findUserById(userId);
                res.status(200).json({ data: findOneUserData, message: 'findOne' });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteUser = async (req, res, next) => {
            try {
                const userId = req.params.id;
                const deleteUserData = await this.userService.deleteUser(userId);
                res.status(200).json({ data: deleteUserData, message: 'deleted' });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = UsersController;
//# sourceMappingURL=users.controller.js.map