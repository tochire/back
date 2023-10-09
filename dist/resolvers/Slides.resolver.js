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
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const Slide_1 = require("../models/Slide");
const User_1 = require("../models/User/User");
const Utils_1 = require("../models/Utils");
const slides_1 = require("../modules/google/slides");
let SlidesResponse = class SlidesResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Utils_1.ErrorType], { nullable: true }),
    __metadata("design:type", Array)
], SlidesResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Slide_1.SlideType], { nullable: true }),
    __metadata("design:type", Array)
], SlidesResponse.prototype, "data", void 0);
SlidesResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], SlidesResponse);
let SlideResolver = class SlideResolver {
    async slides({ user }) {
        if (!user || !user.id) {
            return {
                errors: [
                    {
                        code: 'Unauthorized',
                        msg: 'You must be logged in to get for this query',
                    },
                ],
            };
        }
        const fullUser = await User_1.User.findOne({ _id: user.id });
        const slides = await (0, slides_1.getAllSlides)(fullUser);
        return {
            data: slides,
        };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => SlidesResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SlideResolver.prototype, "slides", null);
SlideResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], SlideResolver);
exports.default = SlideResolver;
