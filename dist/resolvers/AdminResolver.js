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
const isAdminAt_1 = require("../models/Admin/isAdminAt");
const Shop_1 = require("../models/Shop/Shop");
const User_1 = require("../models/User/User");
const Utils_1 = require("../models/Utils");
const AdminType_1 = __importDefault(require("../models/Admin/AdminType"));
const PermissionsType_1 = __importDefault(require("../models/Admin/PermissionsType"));
const updatePermissionsInput_1 = __importDefault(require("../models/Admin/updatePermissionsInput"));
const moment_1 = __importDefault(require("moment"));
let MessageResponse = class MessageResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Utils_1.ErrorType], { nullable: true }),
    __metadata("design:type", Array)
], MessageResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], MessageResponse.prototype, "message", void 0);
MessageResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], MessageResponse);
let PermissionsResponse = class PermissionsResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Utils_1.ErrorType], { nullable: true }),
    __metadata("design:type", Array)
], PermissionsResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => PermissionsType_1.default, { nullable: true }),
    __metadata("design:type", PermissionsType_1.default)
], PermissionsResponse.prototype, "permissions", void 0);
PermissionsResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], PermissionsResponse);
let AdminResponse = class AdminResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Utils_1.ErrorType], { nullable: true }),
    __metadata("design:type", Array)
], AdminResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [AdminType_1.default], { nullable: true }),
    __metadata("design:type", Array)
], AdminResponse.prototype, "admins", void 0);
AdminResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], AdminResponse);
let AdminResolver = class AdminResolver {
    async addAdmin(shopId, email, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        const shop = await Shop_1.Shop.findOne({ _id: shopId });
        if (!shop) {
            return { errors: [{ msg: "shop not found", code: "404" }] };
        }
        if (shop.ownerId != ctx.user.id) {
            return { errors: [{ msg: "permission denied", code: "401" }] };
        }
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        const isAdmin = await isAdminAt_1.isAdminAt.findOne({ userId: user._id, shopId });
        if (isAdmin) {
            return {
                errors: [
                    { msg: "this user is already an admin in your shop", code: "400" },
                ],
            };
        }
        const newAdmin = new isAdminAt_1.isAdminAt({
            shopId,
            userId: user._id,
            date: (0, moment_1.default)().unix(),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
        });
        await newAdmin.save();
        return { message: "admin added successfully" };
    }
    async admins(shopId, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        const shop = await Shop_1.Shop.findOne({ _id: shopId });
        if (!shop) {
            return { errors: [{ msg: "shop not found", code: "404" }] };
        }
        if (shop.ownerId != ctx.user.id) {
            return { errors: [{ msg: "permission denied", code: "401" }] };
        }
        const admins = await isAdminAt_1.isAdminAt.find({ shopId });
        return { admins };
    }
    async removeAdmin(shopId, adminId, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        const shop = await Shop_1.Shop.findOne({ _id: shopId });
        if (!shop) {
            return { errors: [{ msg: "shop not found", code: "404" }] };
        }
        if (shop.ownerId != ctx.user.id) {
            return { errors: [{ msg: "permission denied", code: "401" }] };
        }
        const admin = await isAdminAt_1.isAdminAt.findOne({ userId: adminId, shopId });
        if (!admin) {
            return { errors: [{ msg: "admin not found", code: "404" }] };
        }
        admin.remove();
        return "removed successfully";
    }
    async permissions(shopId, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        const shop = await Shop_1.Shop.findOne({ _id: shopId });
        if (!shop) {
            return { errors: [{ msg: "shop not found", code: "404" }] };
        }
        if (shop.ownerId == ctx.user.id) {
            return {
                permissions: {
                    categories: true,
                    products: true,
                    orders: true,
                    customers: true,
                    logs: true,
                    admins: true,
                    statistics: true,
                },
            };
        }
        const admin = await isAdminAt_1.isAdminAt.findOne({ shopId, userId: ctx.user.id });
        if (!admin) {
            return { errors: [{ msg: "manager not found", code: "404" }] };
        }
        return { permissions: Object.assign(admin, { admins: false }) };
    }
    async updatePermissions(shopId, adminId, permissions, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        const shop = await Shop_1.Shop.findOne({ _id: shopId });
        if (!shop) {
            return { errors: [{ msg: "shop not found", code: "404" }] };
        }
        if (shop.ownerId != ctx.user.id) {
            return { errors: [{ msg: "permission denied", code: "401" }] };
        }
        const admin = await isAdminAt_1.isAdminAt.findOne({ userId: adminId, shopId });
        if (!admin) {
            return { errors: [{ msg: "admin not found", code: "404" }] };
        }
        Object.assign(admin, permissions);
        await admin.save();
        return "permissions update successfully";
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => MessageResponse),
    __param(0, (0, type_graphql_1.Arg)("shopId")),
    __param(1, (0, type_graphql_1.Arg)("email")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "addAdmin", null);
__decorate([
    (0, type_graphql_1.Query)(() => AdminResponse),
    __param(0, (0, type_graphql_1.Arg)("shopId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "admins", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("shopId")),
    __param(1, (0, type_graphql_1.Arg)("adminId")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "removeAdmin", null);
__decorate([
    (0, type_graphql_1.Query)(() => PermissionsResponse),
    __param(0, (0, type_graphql_1.Arg)("shopId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "permissions", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("shopId")),
    __param(1, (0, type_graphql_1.Arg)("adminId")),
    __param(2, (0, type_graphql_1.Arg)("permissions")),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, updatePermissionsInput_1.default, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "updatePermissions", null);
AdminResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AdminResolver);
exports.default = AdminResolver;
