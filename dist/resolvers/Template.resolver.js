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
const Template_1 = require("../models/Template/Template");
const Utils_1 = require("../models/Utils");
const AddTemplateInput_1 = require("../models/Template/Input/AddTemplateInput");
const UpdateTemplateInput_1 = require("../models/Template/Input/UpdateTemplateInput");
let TemplateResponse = class TemplateResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Utils_1.ErrorType], { nullable: true }),
    __metadata("design:type", Array)
], TemplateResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Template_1.TemplateType, { nullable: true }),
    __metadata("design:type", Template_1.Template)
], TemplateResponse.prototype, "template", void 0);
TemplateResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], TemplateResponse);
let TemplateResolver = class TemplateResolver {
    async templates({ user }, name) {
        if (!user || !user.id) {
            throw new type_graphql_1.UnauthorizedError();
        }
        return Template_1.Template.find(name
            ? {
                name: {
                    $regex: new RegExp(`${name}`, 'gi'),
                },
                isActive: true,
            }
            : {
                isActive: true,
            });
    }
    async template({ user }, id) {
        if (!user || !user.id) {
            throw new type_graphql_1.UnauthorizedError();
        }
        const template = await Template_1.Template.findOne({ _id: id });
        if (!template) {
            return { errors: [{ msg: "template not found", code: "404" }] };
        }
        return { template: template };
    }
    async addTemplate({ user }, newTemplateData) {
        if (!user || !user.id) {
            throw new type_graphql_1.UnauthorizedError();
        }
        const newTemplate = new Template_1.Template({
            ...newTemplateData,
            ownerId: user.id,
        });
        await newTemplate.save();
        return { template: newTemplate };
    }
    async updateTemplate({ user }, id, updateTemplateData) {
        if (!user || !user.id) {
            throw new type_graphql_1.UnauthorizedError();
        }
        const template = await Template_1.Template.findOne({
            _id: id,
        });
        Object.assign(template, updateTemplateData);
        await template.save();
        return { template };
    }
    async deleteTemplate({ user }, id) {
        if (!user || !user.id) {
            throw new type_graphql_1.UnauthorizedError();
        }
        await Template_1.Template.updateOne({
            _id: id,
        }, {
            isActive: false,
        });
        return {};
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Template_1.TemplateType]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('name', {
        nullable: true,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TemplateResolver.prototype, "templates", null);
__decorate([
    (0, type_graphql_1.Query)(() => TemplateResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id", {
        nullable: true,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TemplateResolver.prototype, "template", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => TemplateResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('template')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AddTemplateInput_1.AddTemplateInput]),
    __metadata("design:returntype", Promise)
], TemplateResolver.prototype, "addTemplate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => TemplateResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('id')),
    __param(2, (0, type_graphql_1.Arg)('template')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateTemplateInput_1.UpdateTemplateInput]),
    __metadata("design:returntype", Promise)
], TemplateResolver.prototype, "updateTemplate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => TemplateResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TemplateResolver.prototype, "deleteTemplate", null);
TemplateResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], TemplateResolver);
exports.default = TemplateResolver;
