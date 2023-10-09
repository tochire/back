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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = exports.UpdateTeamInput = exports.AddTeamInput = exports.TeamType = void 0;
const type_graphql_1 = require("type-graphql");
const Mongoose = __importStar(require("mongoose"));
const Org_1 = require("./Org");
const User_1 = require("./User/User");
const UserType_1 = __importDefault(require("./User/UserType"));
let TeamType = class TeamType {
    async org(team) {
        return Org_1.Org.findOne({ _id: team.orgId });
    }
    async members(team) {
        return User_1.User.find({ _id: team.memberIds });
    }
    async owners(team) {
        return User_1.User.find({ _id: team.ownerIds });
    }
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], TeamType.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TeamType.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TeamType.prototype, "pictureUrl", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], TeamType.prototype, "isDeletable", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Org_1.OrgType),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exports.Team]),
    __metadata("design:returntype", Promise)
], TeamType.prototype, "org", null);
__decorate([
    (0, type_graphql_1.Field)(() => [UserType_1.default]),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exports.Team]),
    __metadata("design:returntype", Promise)
], TeamType.prototype, "members", null);
__decorate([
    (0, type_graphql_1.Field)(() => [UserType_1.default]),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exports.Team]),
    __metadata("design:returntype", Promise)
], TeamType.prototype, "owners", null);
TeamType = __decorate([
    (0, type_graphql_1.ObjectType)()
], TeamType);
exports.TeamType = TeamType;
let AddTeamInput = class AddTeamInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AddTeamInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AddTeamInput.prototype, "orgId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], AddTeamInput.prototype, "memberIds", void 0);
AddTeamInput = __decorate([
    (0, type_graphql_1.InputType)()
], AddTeamInput);
exports.AddTeamInput = AddTeamInput;
let UpdateTeamInput = class UpdateTeamInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateTeamInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateTeamInput.prototype, "pictureUrl", void 0);
UpdateTeamInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdateTeamInput);
exports.UpdateTeamInput = UpdateTeamInput;
const TeamSchema = new Mongoose.Schema({
    name: String,
    pictureUrl: String,
    orgId: String,
    memberIds: [String],
    ownerIds: [String],
    isActive: { type: Boolean, default: true },
    isDeletable: { type: Boolean, default: true },
});
exports.Team = Mongoose.model('team', TeamSchema);
