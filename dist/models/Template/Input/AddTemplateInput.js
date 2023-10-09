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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTemplateInput = void 0;
const type_graphql_1 = require("type-graphql");
const DocumentType_1 = require("./DocumentType");
let AddTemplateInput = class AddTemplateInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AddTemplateInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => DocumentType_1.DocumentInput),
    __metadata("design:type", DocumentType_1.DocumentInput)
], AddTemplateInput.prototype, "document", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AddTemplateInput.prototype, "teamId", void 0);
AddTemplateInput = __decorate([
    (0, type_graphql_1.InputType)()
], AddTemplateInput);
exports.AddTemplateInput = AddTemplateInput;
