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
exports.RORResolver = void 0;
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const ROR_1 = require("../entities/ROR");
const branch_1 = require("./branch");
let RORInput = class RORInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RORInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], RORInput.prototype, "buying", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], RORInput.prototype, "pieces", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], RORInput.prototype, "selling", void 0);
RORInput = __decorate([
    (0, type_graphql_1.InputType)()
], RORInput);
let RORResolver = class RORResolver {
    addROR(args, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ROR_1.ROR.create(Object.assign(Object.assign({}, args), { creatorId: req.session.userId })).save();
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
    editROR(id, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const _ROR = yield ROR_1.ROR.findOne(id);
            if (!_ROR)
                return {
                    status: false,
                    error: { target: "general", message: "ROR does not exist!" },
                };
            try {
                yield ROR_1.ROR.update({ id }, Object.assign({}, args));
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
    deleteROR(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ROR_1.ROR.delete(id);
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
    getRORs({ req }) {
        return ROR_1.ROR.find({ where: { creatorId: req.session.userId } });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("args", () => RORInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RORInput, Object]),
    __metadata("design:returntype", Promise)
], RORResolver.prototype, "addROR", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("args", () => RORInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, RORInput]),
    __metadata("design:returntype", Promise)
], RORResolver.prototype, "editROR", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RORResolver.prototype, "deleteROR", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ROR_1.ROR]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RORResolver.prototype, "getRORs", null);
RORResolver = __decorate([
    (0, type_graphql_1.Resolver)(ROR_1.ROR)
], RORResolver);
exports.RORResolver = RORResolver;
//# sourceMappingURL=ror.js.map