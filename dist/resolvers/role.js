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
exports.RoleResolver = void 0;
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const Role_1 = require("../entities/Role");
const branch_1 = require("./branch");
let RoleResolver = class RoleResolver {
    addRole(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Role_1.Role.create({ name }).save();
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
    editRole(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!name || name === "")
                return {
                    status: false,
                    error: { target: "general", message: "name can not be empty!" },
                };
            const role = yield Role_1.Role.findOne(id);
            if (!role)
                return {
                    status: false,
                    error: { target: "general", message: "role does not exist!" },
                };
            try {
                yield Role_1.Role.update({ id }, { name });
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
    deleteRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Role_1.Role.delete(id);
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
    getRoles() {
        return Role_1.Role.find({ relations: ["users"] });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("name", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "addRole", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("name", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "editRole", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "deleteRole", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Role_1.Role]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "getRoles", null);
RoleResolver = __decorate([
    (0, type_graphql_1.Resolver)(Role_1.Role)
], RoleResolver);
exports.RoleResolver = RoleResolver;
//# sourceMappingURL=role.js.map