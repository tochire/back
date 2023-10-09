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
const Product_1 = require("../models/Product/Product");
const Shop_1 = require("../models/Shop/Shop");
const Log_1 = require("../models/Log/Log");
const Utils_1 = require("../models/Utils");
const ProductType_1 = __importDefault(require("../models/Product/ProductType"));
const CreateProductInput_1 = __importDefault(require("../models/Product/CreateProductInput"));
const UpdateProductInput_1 = __importDefault(require("../models/Product/UpdateProductInput"));
const moment_1 = __importDefault(require("moment"));
let ProductResponse = class ProductResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Utils_1.ErrorType], { nullable: true }),
    __metadata("design:type", Array)
], ProductResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => ProductType_1.default, { nullable: true }),
    __metadata("design:type", Product_1.Product)
], ProductResponse.prototype, "product", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ProductType_1.default], { nullable: true }),
    __metadata("design:type", Array)
], ProductResponse.prototype, "products", void 0);
ProductResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ProductResponse);
let ProductResolver = class ProductResolver {
    async addProduct(productData, shopId, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        let shop = await Shop_1.Shop.findOne({ _id: shopId, isActive: true });
        if (!shop) {
            return { errors: [{ msg: "shop not found", code: "404" }] };
        }
        if (shop.ownerId != ctx.user.id) {
            return { errors: [{ msg: "this action is unauthorized", code: "401" }] };
        }
        let product = new Product_1.Product(productData);
        product.createdBy = ctx.user.id;
        product.isActive = true;
        product.creationDate = (0, moment_1.default)().unix();
        product.shopId = shop._id;
        await product.save();
        let log = new Log_1.Log({
            loggerId: ctx.user.id,
            shopId: shopId,
            time: (0, moment_1.default)().unix(),
            action: "proudct has been created",
        });
        await log.save();
        return { product: product };
    }
    async deleteProduct(productId, ctx) {
        if (!ctx.user) {
            return { errors: [{ msg: "user not found", code: "404" }] };
        }
        let product = await Product_1.Product.findOne({ _id: productId, isActive: true });
        if (!product) {
            return { errors: [{ msg: "shop not found", code: "404" }] };
        }
        let shop = await Shop_1.Shop.findOne({ _id: product.shopId });
        if (shop.ownerId != ctx.user.id) {
            return { errors: [{ msg: "this action is unauthorized", code: "401" }] };
        }
        await product.delete();
        let log = new Log_1.Log({
            loggerId: ctx.user.id,
            shopId: shop._id,
            time: (0, moment_1.default)().unix(),
            action: "proudct has been deleted",
        });
        await log.save();
        return { product: product };
    }
    async product(productId, ctx) {
        let product = await Product_1.Product.findOne({ _id: productId, isActive: true });
        if (!product) {
            return { errors: [{ msg: "product not found", code: "404" }] };
        }
        return { product: product };
    }
    async products(ctx, name, shopId) {
        return Product_1.Product.find(name
            ? {
                name: {
                    $regex: new RegExp(`${name}`, "gi"),
                },
                isActive: true,
                shopId: shopId,
            }
            : {
                isActive: true,
                shopId: shopId,
            });
    }
    async updateProduct(ctx, productId, updateProductData) {
        if (!ctx.user || !ctx.user.id) {
            if (!ctx.user) {
                return { errors: [{ msg: "user not found", code: "404" }] };
            }
        }
        const product = await Product_1.Product.findOne({
            _id: productId,
        });
        if (!product) {
            return { errors: [{ msg: "product not found", code: "404" }] };
        }
        const shop = await Shop_1.Shop.findOne({ _id: product.shopId });
        if (shop.ownerId != ctx.user.id) {
            return { errors: [{ msg: "this action is unauthorized", code: "401" }] };
        }
        Object.assign(product, updateProductData);
        await product.save();
        return { product: product };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => ProductResponse),
    __param(0, (0, type_graphql_1.Arg)("product")),
    __param(1, (0, type_graphql_1.Arg)("shopId")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProductInput_1.default, String, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "addProduct", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ProductResponse),
    __param(0, (0, type_graphql_1.Arg)("productId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "deleteProduct", null);
__decorate([
    (0, type_graphql_1.Query)(() => ProductResponse),
    __param(0, (0, type_graphql_1.Arg)("productId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "product", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ProductType_1.default]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("name", {
        nullable: true,
    })),
    __param(2, (0, type_graphql_1.Arg)("shopId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "products", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ProductResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("productId")),
    __param(2, (0, type_graphql_1.Arg)("product")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateProductInput_1.default]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "updateProduct", null);
ProductResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ProductResolver);
exports.default = ProductResolver;
