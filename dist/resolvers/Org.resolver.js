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
const Org_1 = require("../models/Org");
const Team_1 = require("../models/Team");
const Utils_1 = require("../models/Utils");
let OrgResponse = class OrgResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Utils_1.ErrorType], { nullable: true }),
    __metadata("design:type", Array)
], OrgResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Org_1.OrgType, { nullable: true }),
    __metadata("design:type", Org_1.Org)
], OrgResponse.prototype, "org", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Team_1.TeamType, { nullable: true }),
    __metadata("design:type", Team_1.Team)
], OrgResponse.prototype, "team", void 0);
OrgResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], OrgResponse);
let OrgResolver = class OrgResolver {
    async orgs({ user }, name) {
        if (!user || !user.id) {
            throw new type_graphql_1.UnauthorizedError();
        }
        return Org_1.Org.find(name
            ? {
                name: {
                    $regex: new RegExp(`${name}`, "gi"),
                },
                isActive: true,
            }
            : {
                isActive: true,
            });
    }
    async addOrg({ user }, newOrgData) {
        if (!user || !user.id) {
            throw new type_graphql_1.UnauthorizedError();
        }
        const newOrg = new Org_1.Org({ ...newOrgData, ownerIds: [user.id] });
        await newOrg.save();
        const newTeam = new Team_1.Team({
            name: "Everyone",
            ownerIds: [user.id],
            memberIds: [user.id],
            orgId: newOrg.id,
            isDeletable: false,
        });
        await newTeam.save();
        return { org: newOrg, team: newTeam };
    }
    async updateOrg({ user }, id, updateOrgData) {
        if (!user || !user.id) {
            throw new type_graphql_1.UnauthorizedError();
        }
        const org = await Org_1.Org.findOne({
            _id: id,
        });
        Object.assign(org, updateOrgData);
        await org.save();
        return { org };
    }
    async deleteOrg({ user }, id) {
        if (!user || !user.id) {
            throw new type_graphql_1.UnauthorizedError();
        }
        await Org_1.Org.updateOne({
            _id: id,
        }, {
            isActive: false,
        });
        return {};
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Org_1.OrgType]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("name", {
        nullable: true,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrgResolver.prototype, "orgs", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => OrgResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("org")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Org_1.AddOrgInput]),
    __metadata("design:returntype", Promise)
], OrgResolver.prototype, "addOrg", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => OrgResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __param(2, (0, type_graphql_1.Arg)("org")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Org_1.UpdateOrgInput]),
    __metadata("design:returntype", Promise)
], OrgResolver.prototype, "updateOrg", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => OrgResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrgResolver.prototype, "deleteOrg", null);
OrgResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], OrgResolver);
exports.default = OrgResolver;
