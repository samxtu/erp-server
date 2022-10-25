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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetResolver = void 0;
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const Asset_1 = require("../entities/Asset");
const branch_1 = require("./branch");
let AssetInput = class AssetInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AssetInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AssetInput.prototype, "code", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AssetInput.prototype, "condition", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AssetInput.prototype, "details", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], AssetInput.prototype, "branchId", void 0);
AssetInput = __decorate([
    (0, type_graphql_1.InputType)()
], AssetInput);
let AssetResolver = class AssetResolver {
    addAsset(args, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Asset_1.Asset.create(Object.assign(Object.assign({}, args), { creatorId: req.session.userId })).save();
            }
            catch (err) {
                console.error(err.message);
                return {
                    status: false,
                    error: { target: "general", message: err.message },
                };
            }
            return { status: true };
        });
    }
    editAsset(id, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args.name || args.name === "")
                return {
                    status: false,
                    error: { target: "name", message: "Name can not be empty!" },
                };
            if (!args.branchId)
                return {
                    status: false,
                    error: { target: "branch", message: "A branch must be selected!" },
                };
            const asset = yield Asset_1.Asset.findOne(id);
            if (!asset)
                return {
                    status: false,
                    error: { target: "general", message: "Asset does not exist!" },
                };
            try {
                yield Asset_1.Asset.update({ id }, Object.assign({}, args));
            }
            catch (err) {
                console.error(err.message);
                return {
                    status: false,
                    error: { target: "general", message: err.message },
                };
            }
            return { status: true };
        });
    }
    changeCondition(id, condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const asset = yield Asset_1.Asset.findOne(id);
            if (!asset)
                return {
                    status: false,
                    error: { target: "general", message: "Asset does not exist!" },
                };
            try {
                asset.condition = condition;
                yield asset.save();
            }
            catch (err) {
                console.error(err.message);
                return {
                    status: false,
                    error: { target: "general", message: err.message },
                };
            }
            return { status: true };
        });
    }
    deleteAsset(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Asset_1.Asset.delete(id);
            }
            catch (err) {
                console.error(err.message);
                return {
                    status: false,
                    error: { target: "general", message: err.message },
                };
            }
            return { status: true };
        });
    }
    getAssets(branch) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqRes;
            if (branch)
                reqRes = yield Asset_1.Asset.find({
                    where: { branchId: branch },
                    relations: ["branch", "receivedExpenses"],
                });
            else
                reqRes = yield Asset_1.Asset.find({ relations: ["branch", "receivedExpenses"] });
            return reqRes;
        });
    }
    getAsset(id) {
        return Asset_1.Asset.findOne(id, {
            relations: ["receivedExpenses", "creator"],
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("args")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AssetInput, Object]),
    __metadata("design:returntype", Promise)
], AssetResolver.prototype, "addAsset", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("args")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, AssetInput]),
    __metadata("design:returntype", Promise)
], AssetResolver.prototype, "editAsset", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("condition", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AssetResolver.prototype, "changeCondition", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AssetResolver.prototype, "deleteAsset", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Asset_1.Asset]),
    __param(0, (0, type_graphql_1.Arg)("branch", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AssetResolver.prototype, "getAssets", null);
__decorate([
    (0, type_graphql_1.Query)(() => Asset_1.Asset, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AssetResolver.prototype, "getAsset", null);
AssetResolver = __decorate([
    (0, type_graphql_1.Resolver)(Asset_1.Asset)
], AssetResolver);
exports.AssetResolver = AssetResolver;
//# sourceMappingURL=asset.js.map