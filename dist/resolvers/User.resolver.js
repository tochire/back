"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const User_1 = require("../models/User/User");
const Utils_1 = require("../models/Utils");
const UserType_1 = __importDefault(require("../models/User/UserType"));
const RegisterInput_1 = require("../models/User/RegisterInput");
const LoginInput_1 = __importDefault(require("../models/User/LoginInput"));
const UpdateUserInput_1 = __importDefault(require("../models/User/UpdateUserInput"));
const UpdateUserPass_1 = __importDefault(require("../models/User/UpdateUserPass"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const jwt_1 = require("../modules/jwt");
const constants_1 = require("../constants");
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Utils_1.ErrorType], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => UserType_1.default, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserResponse.prototype, "token", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    async register(newUserData) {
        const existingUser = await User_1.User.findOne({
            email: newUserData.email,
        });
        if (existingUser) {
            return {
                errors: [
                    {
                        code: "User.Exists",
                        msg: "This email is already in use",
                    },
                ],
            };
        }
        const newUser = new User_1.User(newUserData);
        newUser.password = await bcrypt_1.default.hash(newUserData.password, 10);
        await newUser.save();
        const token = (0, jsonwebtoken_1.sign)({
            id: newUser.id,
        }, constants_1.__jwt_secret__);
        return { user: newUser, token: token };
    }
    async login(loginInfo, { res }) {
        const user = await User_1.User.findOne({ email: loginInfo.email });
        if (!user) {
            return {
                errors: [
                    {
                        code: "wrong login credentials",
                        msg: "wrong login credentials",
                    },
                ],
            };
        }
        if (!bcrypt_1.default.compareSync(loginInfo.password, user.password)) {
            return { errors: [{ msg: "password is wrong", code: "401" }] };
        }
        const token = (0, jwt_1.getJWT)({ id: user.id });
        return { user: user, token: token };
    }
    //update first and lastname
    async updateUser(user, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        let newUser = await User_1.User.findOne({ _id: ctx.user.id });
        newUser = Object.assign(newUser, user);
        await newUser.save();
        return { user: newUser };
    }
    //update password
    async updatePass(user, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        var newuser = await User_1.User.findOne({ _id: ctx.user.id });
        if (!bcrypt_1.default.compareSync(user.oldpassword, newuser.password)) {
            return { errors: [{ msg: "password is wrong", code: "401" }] };
        }
        newuser.password = await bcrypt_1.default.hash(user.password, 10);
        await newuser.save();
        return { user: newuser };
    }
    async me({ user }) {
        if (user) {
            return User_1.User.findOne({ _id: user.id });
        }
        return null;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput_1.RegisterUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("user")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput_1.default, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("user")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateUserInput_1.default, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("user")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateUserPass_1.default, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updatePass", null);
__decorate([
    (0, type_graphql_1.Query)(() => UserType_1.default, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.default = UserResolver;
