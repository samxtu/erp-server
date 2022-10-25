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
exports.ExpenseResolver = void 0;
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const Expense_1 = require("../entities/Expense");
const branch_1 = require("./branch");
const typeorm_1 = require("typeorm");
const Account_1 = require("../entities/Account");
let ExpenseInput = class ExpenseInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ExpenseInput.prototype, "expenseDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ExpenseInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ExpenseInput.prototype, "details", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], ExpenseInput.prototype, "authorizerId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], ExpenseInput.prototype, "staffId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ExpenseInput.prototype, "assetId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], ExpenseInput.prototype, "ammount", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], ExpenseInput.prototype, "accountId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ExpenseInput.prototype, "type", void 0);
ExpenseInput = __decorate([
    (0, type_graphql_1.InputType)()
], ExpenseInput);
let ExpenseResolver = class ExpenseResolver {
    addExpense(args, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.ammount === 0)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "expense ammount can not be zero!",
                    },
                };
            try {
                (0, typeorm_1.getConnection)().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const acc = yield Account_1.Account.findOne(args.accountId);
                    if (!acc)
                        throw new Error("Account does not exist!");
                    acc.balance = acc.balance - args.ammount;
                    yield acc.save();
                    yield Expense_1.Expense.create(Object.assign(Object.assign({}, args), { creatorId: req.session.userId })).save();
                }));
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
    editExpense(id, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.ammount === 0)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "expense ammount can not be zero!",
                    },
                };
            const xpense = yield Expense_1.Expense.findOne(id);
            if (!xpense)
                return {
                    status: false,
                    error: { target: "general", message: "Expense does not exist!" },
                };
            try {
                (0, typeorm_1.getConnection)().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    if (xpense.ammount !== args.ammount) {
                        const acc = yield Account_1.Account.findOne(args.accountId);
                        if (!acc)
                            throw new Error("Account has been removed!");
                        acc.balance = acc.balance + xpense.ammount - args.ammount;
                        yield acc.save();
                    }
                    yield Expense_1.Expense.update({ id }, Object.assign({}, args));
                }));
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
    deleteExpense(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const xpense = yield Expense_1.Expense.findOne(id);
            if (!xpense)
                return {
                    status: false,
                    error: { target: "general", message: "Expense does not exist!" },
                };
            const acc = yield Account_1.Account.findOne(xpense.accountId);
            if (!acc)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "Account used in this expense does not exist!",
                    },
                };
            try {
                (0, typeorm_1.getConnection)().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    acc.balance = acc.balance + xpense.ammount;
                    acc.save();
                    yield Expense_1.Expense.delete(xpense.id);
                }));
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
    getExpenses() {
        return __awaiter(this, void 0, void 0, function* () {
            let reqRes = yield Expense_1.Expense.find({
                relations: ["authorizer", "staff", "account"],
                order: { expenseDate: "DESC" },
            });
            return reqRes;
        });
    }
    getExpense(id) {
        return Expense_1.Expense.findOne(id, {
            relations: ["authorizer", "staff", "asset", "account", "creator"],
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("args", () => ExpenseInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExpenseInput, Object]),
    __metadata("design:returntype", Promise)
], ExpenseResolver.prototype, "addExpense", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("args", () => ExpenseInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ExpenseInput]),
    __metadata("design:returntype", Promise)
], ExpenseResolver.prototype, "editExpense", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExpenseResolver.prototype, "deleteExpense", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Expense_1.Expense]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExpenseResolver.prototype, "getExpenses", null);
__decorate([
    (0, type_graphql_1.Query)(() => Expense_1.Expense, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExpenseResolver.prototype, "getExpense", null);
ExpenseResolver = __decorate([
    (0, type_graphql_1.Resolver)(Expense_1.Expense)
], ExpenseResolver);
exports.ExpenseResolver = ExpenseResolver;
//# sourceMappingURL=expense.js.map