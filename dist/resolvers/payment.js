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
exports.PaymentResolver = void 0;
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const Payment_1 = require("../entities/Payment");
const branch_1 = require("./branch");
const typeorm_1 = require("typeorm");
const Account_1 = require("../entities/Account");
let PaymentInput = class PaymentInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PaymentInput.prototype, "paymentDate", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PaymentInput.prototype, "details", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], PaymentInput.prototype, "payerId", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], PaymentInput.prototype, "collectorId", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], PaymentInput.prototype, "ammount", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], PaymentInput.prototype, "accountId", void 0);
PaymentInput = __decorate([
    type_graphql_1.InputType()
], PaymentInput);
let PaymentResolver = class PaymentResolver {
    addPayment(args, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.ammount === 0)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "Payment ammount can not be zero!",
                    },
                };
            try {
                typeorm_1.getConnection().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const acc = yield Account_1.Account.findOne(args.accountId);
                    if (!acc)
                        throw new Error("Account does not exist!");
                    acc.balance = acc.balance + args.ammount;
                    yield acc.save();
                    yield Payment_1.Payment.create(Object.assign(Object.assign({}, args), { creatorId: req.session.userId })).save();
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
    editPayment(id, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.ammount === 0)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "Payment ammount can not be zero!",
                    },
                };
            const payment = yield Payment_1.Payment.findOne(id);
            if (!payment)
                return {
                    status: false,
                    error: { target: "general", message: "Payment does not exist!" },
                };
            try {
                typeorm_1.getConnection().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    if (payment.ammount !== args.ammount) {
                        const acc = yield Account_1.Account.findOne(args.accountId);
                        if (!acc)
                            throw new Error("Account has been removed!");
                        acc.balance = acc.balance - payment.ammount + args.ammount;
                        yield acc.save();
                    }
                    yield Payment_1.Payment.update({ id }, Object.assign({}, args));
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
    deletePayment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield Payment_1.Payment.findOne(id);
            if (!payment)
                return {
                    status: false,
                    error: { target: "general", message: "Payment does not exist!" },
                };
            const acc = yield Account_1.Account.findOne(payment.accountId);
            if (!acc)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "Account used in this Payment does not exist!",
                    },
                };
            try {
                typeorm_1.getConnection().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    acc.balance = acc.balance - payment.ammount;
                    acc.save();
                    yield Payment_1.Payment.delete(payment.id);
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
    getPayments() {
        return __awaiter(this, void 0, void 0, function* () {
            let reqRes = yield Payment_1.Payment.find({
                relations: ["payer", "collector", "account"],
                order: { paymentDate: "DESC" },
            });
            return reqRes;
        });
    }
    getPayment(id) {
        return Payment_1.Payment.findOne(id, {
            relations: ["payer", "collector", "account", "creator"],
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => branch_1.BooleanResponse),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("args", () => PaymentInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaymentInput, Object]),
    __metadata("design:returntype", Promise)
], PaymentResolver.prototype, "addPayment", null);
__decorate([
    type_graphql_1.Mutation(() => branch_1.BooleanResponse),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Arg("args", () => PaymentInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, PaymentInput]),
    __metadata("design:returntype", Promise)
], PaymentResolver.prototype, "editPayment", null);
__decorate([
    type_graphql_1.Mutation(() => branch_1.BooleanResponse),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentResolver.prototype, "deletePayment", null);
__decorate([
    type_graphql_1.Query(() => [Payment_1.Payment]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentResolver.prototype, "getPayments", null);
__decorate([
    type_graphql_1.Query(() => Payment_1.Payment, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentResolver.prototype, "getPayment", null);
PaymentResolver = __decorate([
    type_graphql_1.Resolver(Payment_1.Payment)
], PaymentResolver);
exports.PaymentResolver = PaymentResolver;
//# sourceMappingURL=payment.js.map