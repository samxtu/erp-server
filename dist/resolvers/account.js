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
exports.AccountResolver = void 0;
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const Account_1 = require("../entities/Account");
const branch_1 = require("./branch");
let AccountInput = class AccountInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AccountInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AccountInput.prototype, "number", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], AccountInput.prototype, "branchId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], AccountInput.prototype, "balance", void 0);
AccountInput = __decorate([
    (0, type_graphql_1.InputType)()
], AccountInput);
let AccountResolver = class AccountResolver {
    addAccount(args, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args.name || args.name === "")
                return {
                    status: false,
                    error: { target: "name", message: "Name can not be empty!" },
                };
            try {
                yield Account_1.Account.create(Object.assign(Object.assign({}, args), { creatorId: req.session.userId })).save();
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
    editAccount(id, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args.name || args.name === "")
                return {
                    status: false,
                    error: { target: "name", message: "Name can not be empty!" },
                };
            const account = yield Account_1.Account.findOne(id);
            if (!account)
                return {
                    status: false,
                    error: { target: "general", message: "Account does not exist!" },
                };
            try {
                yield Account_1.Account.update({ id }, Object.assign({}, args));
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
    changeAmmount(id, ammount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ammount === 0)
                return {
                    status: false,
                    error: { target: "ammount", message: "Ammount required!" },
                };
            const account = yield Account_1.Account.findOne(id);
            if (!account)
                return {
                    status: false,
                    error: { target: "general", message: "Account does not exist!" },
                };
            try {
                account.balance = account.balance + ammount;
                yield account.save();
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
    deleteAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Account_1.Account.delete(id);
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
    getAccounts(branch) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqRes;
            if (branch) {
                reqRes = yield Account_1.Account.find({
                    where: { branchId: branch },
                    relations: ["branch"],
                });
            }
            else
                reqRes = yield Account_1.Account.find({ relations: ["branch"] });
            return reqRes;
        });
    }
    getAccount(id) {
        return Account_1.Account.findOne(id, {
            relations: ["payments", "sales", "purchases", "expenses", "creator"],
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("args")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AccountInput, Object]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "addAccount", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("args")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, AccountInput]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "editAccount", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("ammount", () => type_graphql_1.Float)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "changeAmmount", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "deleteAccount", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Account_1.Account]),
    __param(0, (0, type_graphql_1.Arg)("branch", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "getAccounts", null);
__decorate([
    (0, type_graphql_1.Query)(() => Account_1.Account, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "getAccount", null);
AccountResolver = __decorate([
    (0, type_graphql_1.Resolver)(Account_1.Account)
], AccountResolver);
exports.AccountResolver = AccountResolver;
//# sourceMappingURL=account.js.map