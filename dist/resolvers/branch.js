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
exports.BranchResolver = exports.BooleanResponse = void 0;
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const Branch_1 = require("../entities/Branch");
const User_1 = require("./User");
let BranchInput = class BranchInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], BranchInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], BranchInput.prototype, "phone", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], BranchInput.prototype, "regionId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], BranchInput.prototype, "street", void 0);
BranchInput = __decorate([
    (0, type_graphql_1.InputType)()
], BranchInput);
let BooleanResponse = class BooleanResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], BooleanResponse.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.FieldError, { nullable: true }),
    __metadata("design:type", User_1.FieldError)
], BooleanResponse.prototype, "error", void 0);
BooleanResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], BooleanResponse);
exports.BooleanResponse = BooleanResponse;
let BranchResolver = class BranchResolver {
    addBranch(args, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Branch_1.Branch.create(Object.assign({}, args)).save();
            }
            catch (err) {
                console.error(err);
                return {
                    status: false,
                    error: { target: "general", message: err.message },
                };
            }
            return { status: true };
        });
    }
    editBranch(id, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args.name || args.name === "")
                return {
                    status: false,
                    error: { target: "name", message: "Name can not be empty!" },
                };
            const branch = yield Branch_1.Branch.findOne(id);
            if (!branch)
                return {
                    status: false,
                    error: { target: "general", message: "branch does not exist!" },
                };
            try {
                yield Branch_1.Branch.update({ id }, Object.assign({}, args));
            }
            catch (err) {
                console.log(err.message);
                return {
                    status: false,
                    error: { target: "general", message: err.message },
                };
            }
            return { status: true };
        });
    }
    deleteBranch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Branch_1.Branch.delete(id);
            }
            catch (err) {
                console.log(err.message);
                return {
                    status: false,
                    error: { target: "general", message: err.message },
                };
            }
            return { status: true };
        });
    }
    getBranches() {
        return __awaiter(this, void 0, void 0, function* () {
            let reqRes = yield Branch_1.Branch.find({ relations: ["region"] });
            return reqRes;
        });
    }
    getBranch(id) {
        return Branch_1.Branch.findOne(id, {
            relations: ["users", "assets", "accounts", "creator"],
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => BooleanResponse),
    __param(0, (0, type_graphql_1.Arg)("args")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BranchInput, Object]),
    __metadata("design:returntype", Promise)
], BranchResolver.prototype, "addBranch", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("args")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, BranchInput]),
    __metadata("design:returntype", Promise)
], BranchResolver.prototype, "editBranch", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BranchResolver.prototype, "deleteBranch", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Branch_1.Branch]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BranchResolver.prototype, "getBranches", null);
__decorate([
    (0, type_graphql_1.Query)(() => Branch_1.Branch, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BranchResolver.prototype, "getBranch", null);
BranchResolver = __decorate([
    (0, type_graphql_1.Resolver)(Branch_1.Branch)
], BranchResolver);
exports.BranchResolver = BranchResolver;
//# sourceMappingURL=branch.js.map