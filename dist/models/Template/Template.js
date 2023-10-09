"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = exports.TemplateType = void 0;
const type_graphql_1 = require("type-graphql");
const Mongoose = __importStar(require("mongoose"));
const TemplateDocument_1 = require("./TemplateDocument");
const slides_1 = require("../../modules/google/slides");
const User_1 = require("../User/User");
let TemplateType = class TemplateType {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], TemplateType.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TemplateType.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => TemplateDocument_1.TemplateDocumentType),
    __metadata("design:type", Object)
], TemplateType.prototype, "document", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TemplateType.prototype, "ownerId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TemplateType.prototype, "teamId", void 0);
TemplateType = __decorate([
    (0, type_graphql_1.ObjectType)()
], TemplateType);
exports.TemplateType = TemplateType;
const TemplateSchema = new Mongoose.Schema({
    name: String,
    document: {
        templateType: { required: true, type: String },
        slideId: { required: false, type: String },
        fields: [String],
    },
    ownerId: String,
    teamId: String,
    isActive: { type: Boolean, default: true },
});
async function updateVariables() {
    if (this.document.templateType === 'slide') {
        const user = await User_1.User.findOne({ _id: this.ownerId });
        if (!user.googleAccount || !user.googleAccount.refresh_token) {
            return;
        }
        const vars = await (0, slides_1.getVariablesFromSlide)(this.document.slideId, user.googleAccount.refresh_token);
        const finalVars = (0, slides_1.cleanVariables)(vars);
        this.document.fields = finalVars;
    }
}
TemplateSchema.pre('save', updateVariables);
TemplateSchema.pre('updateOne', updateVariables);
TemplateSchema.pre('insertMany', updateVariables);
exports.Template = Mongoose.model('Template', TemplateSchema);
