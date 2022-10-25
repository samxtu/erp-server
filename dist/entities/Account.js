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
exports.Account = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Branch_1 = require("./Branch");
const Expense_1 = require("./Expense");
const Payment_1 = require("./Payment");
const Purchase_1 = require("./Purchase");
const Sale_1 = require("./Sale");
const User_1 = require("./User");
let Account = class Account extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Account.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Object)
], Account.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Object)
], Account.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Account.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Account.prototype, "number", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "bigint", default: 0 }),
    __metadata("design:type", Number)
], Account.prototype, "balance", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Account.prototype, "branchId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Branch_1.Branch),
    (0, typeorm_1.ManyToOne)(() => Branch_1.Branch, (branch) => branch.accounts),
    __metadata("design:type", Branch_1.Branch)
], Account.prototype, "branch", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Account.prototype, "creatorId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.createdAccounts),
    __metadata("design:type", User_1.User)
], Account.prototype, "creator", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Payment_1.Payment]),
    (0, typeorm_1.OneToMany)(() => Payment_1.Payment, (payment) => payment.account),
    __metadata("design:type", Array)
], Account.prototype, "payments", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Sale_1.Sale]),
    (0, typeorm_1.OneToMany)(() => Sale_1.Sale, (sale) => sale.account),
    __metadata("design:type", Array)
], Account.prototype, "sales", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Purchase_1.Purchase]),
    (0, typeorm_1.OneToMany)(() => Purchase_1.Purchase, (purchase) => purchase.account),
    __metadata("design:type", Array)
], Account.prototype, "purchases", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Expense_1.Expense]),
    (0, typeorm_1.OneToMany)(() => Expense_1.Expense, (exp) => exp.account),
    __metadata("design:type", Array)
], Account.prototype, "expenses", void 0);
Account = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Account);
exports.Account = Account;
//# sourceMappingURL=Account.js.map