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
const Shop_1 = require("../models/Shop/Shop");
const Product_1 = require("../models/Product/Product");
const Log_1 = require("../models/Log/Log");
const Utils_1 = require("../models/Utils");
const ShopType_1 = __importDefault(require("../models/Shop/ShopType"));
const LogType_1 = __importDefault(require("../models/Log/LogType"));
const UpdateShopInput_1 = __importDefault(require("../models/Shop/UpdateShopInput"));
const moment_1 = __importDefault(require("moment"));
const isAdminAt_1 = require("../models/Admin/isAdminAt");
let ShopResponse = class ShopResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Utils_1.ErrorType], { nullable: true }),
    __metadata("design:type", Array)
], ShopResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => ShopType_1.default, { nullable: true }),
    __metadata("design:type", Shop_1.Shop)
], ShopResponse.prototype, "shop", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ShopType_1.default], { nullable: true }),
    __metadata("design:type", Array)
], ShopResponse.prototype, "shops", void 0);
ShopResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ShopResponse);
let LogResponse = class LogResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Utils_1.ErrorType], { nullable: true }),
    __metadata("design:type", Array)
], LogResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [LogType_1.default], { nullable: true }),
    __metadata("design:type", Array)
], LogResponse.prototype, "logs", void 0);
LogResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], LogResponse);
let ShopResolver = class ShopResolver {
    async createShop(name, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "shop not found", code: "404" }] };
        }
        let existingShop = await Shop_1.Shop.findOne({ name: name, isActive: true });
        if (existingShop) {
            return {
                errors: [
                    {
                        code: "Shop.Exists",
                        msg: "this name is already used",
                    },
                ],
            };
        }
        let newShop = new Shop_1.Shop({
            name: name,
            ownerId: ctx.user.id,
            isActive: true,
            creationDate: (0, moment_1.default)().unix(),
        });
        await newShop.save();
        return { shop: newShop };
    }
    async updateShop(shopId, shopData, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        let shop = await Shop_1.Shop.findOne({ _id: shopId, isActive: true });
        if (!shop) {
            return { errors: [{ msg: "shop not found", code: "404" }] };
        }
        if (shop.ownerId != ctx.user.id) {
            return {
                errors: [
                    { msg: "you do not have permission to do this action", code: "401" },
                ],
            };
        }
        shop = Object.assign(shop, shopData);
        await shop.save();
        let log = new Log_1.Log({
            loggerId: ctx.user.id,
            shopId: shopId,
            time: (0, moment_1.default)().unix(),
            action: "shop has been updated",
        });
        await log.save();
        return { shop: shop };
    }
    async deleteShop(shopId, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        let shop = await Shop_1.Shop.findOne({ _id: shopId, isActive: true });
        if (!shop) {
            return { errors: [{ msg: "shop not found", code: "404" }] };
        }
        if (shop.ownerId != ctx.user.id) {
            return {
                errors: [
                    { msg: "you do not have permission to do this action", code: "401" },
                ],
            };
        }
        shop.isActive = false;
        await shop.save();
        let log = new Log_1.Log({
            loggerId: ctx.user.id,
            shopId: shopId,
            time: (0, moment_1.default)().unix(),
            action: "shop has been deleted",
        });
        await log.save();
        return { shop: shop };
    }
    async myShops(ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        const shops = await Shop_1.Shop.find({
            ownerId: ctx.user.id,
            isActive: true,
        });
        return { shops: shops };
    }
    async admininShops(ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        const adminin = await isAdminAt_1.isAdminAt.find({ userId: ctx.user.id });
        const ids = adminin.map((x) => x.shopId);
        const shops = await Shop_1.Shop.find({ _id: { $in: ids } });
        return { shops };
    }
    async shop(ctx, id) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        const shop = await Shop_1.Shop.findOne({ _id: id });
        return { shop };
    }
    async addCategory(name, shopId, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        let shop = await Shop_1.Shop.findOne({ _id: shopId, isActive: true });
        if (!shop) {
            return { errors: [{ msg: "shop not found", code: "404" }] };
        }
        if (shop.ownerId != ctx.user.id) {
            return {
                errors: [
                    { msg: "you do not have permission to do this action", code: "401" },
                ],
            };
        }
        if (shop.categories.includes(name)) {
            return "category already exists";
        }
        shop.categories.push(name);
        await shop.save();
        return "category saved successfully";
    }
    async deleteCategory(name, shopId, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        let shop = await Shop_1.Shop.findOne({ _id: shopId, isActive: true });
        if (!shop) {
            return { errors: [{ msg: "shop not found", code: "404" }] };
        }
        if (shop.ownerId != ctx.user.id) {
            return {
                errors: [
                    { msg: "you do not have permission to do this action", code: "401" },
                ],
            };
        }
        if (!shop.categories.includes(name)) {
            return "category does not exist";
        }
        shop.categories.splice(shop.categories.indexOf(name), 1);
        await shop.save();
        await Product_1.Product.updateMany({ category: name }, { category: "" });
        return "category deleted successfully";
    }
    async logs(shopId, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        let shop = await Shop_1.Shop.findOne({ _id: shopId, isActive: true });
        if (!shop) {
            return { errors: [{ msg: "shop not found", code: "404" }] };
        }
        if (shop.ownerId != ctx.user.id) {
            return {
                errors: [
                    { msg: "you do not have permission to do this action", code: "401" },
                ],
            };
        }
        const logs = await Log_1.Log.find({ shopId });
        return { logs };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => ShopResponse),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShopResolver.prototype, "createShop", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ShopResponse),
    __param(0, (0, type_graphql_1.Arg)("shopId")),
    __param(1, (0, type_graphql_1.Arg)("shop")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateShopInput_1.default, Object]),
    __metadata("design:returntype", Promise)
], ShopResolver.prototype, "updateShop", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ShopResponse),
    __param(0, (0, type_graphql_1.Arg)("shopId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShopResolver.prototype, "deleteShop", null);
__decorate([
    (0, type_graphql_1.Query)(() => ShopResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShopResolver.prototype, "myShops", null);
__decorate([
    (0, type_graphql_1.Query)(() => ShopResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShopResolver.prototype, "admininShops", null);
__decorate([
    (0, type_graphql_1.Query)(() => ShopResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ShopResolver.prototype, "shop", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __param(1, (0, type_graphql_1.Arg)("shopId")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ShopResolver.prototype, "addCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __param(1, (0, type_graphql_1.Arg)("shopId")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ShopResolver.prototype, "deleteCategory", null);
__decorate([
    (0, type_graphql_1.Query)(() => LogResponse),
    __param(0, (0, type_graphql_1.Arg)("shopId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShopResolver.prototype, "logs", null);
ShopResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ShopResolver);
exports.default = ShopResolver;
