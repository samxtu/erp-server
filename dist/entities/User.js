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
exports.User = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
const Asset_1 = require("./Asset");
const Attendance_1 = require("./Attendance");
const Branch_1 = require("./Branch");
const Expense_1 = require("./Expense");
const Incentive_1 = require("./Incentive");
const IncentiveSheet_1 = require("./IncentiveSheet");
const Note_1 = require("./Note");
const Payment_1 = require("./Payment");
const Product_1 = require("./Product");
const Purchase_1 = require("./Purchase");
const Role_1 = require("./Role");
const ROR_1 = require("./ROR");
const Sale_1 = require("./Sale");
let User = class User extends typeorm_1.BaseEntity {
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
], User.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Object)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "text", unique: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "text", unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "text", unique: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], User.prototype, "location", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "bigint" }),
    __metadata("design:type", Number)
], User.prototype, "maxCredit", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], User.prototype, "creditDays", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "credit", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "bigint", default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "balance", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "bigint", default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "salary", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], User.prototype, "roleId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Role_1.Role),
    (0, typeorm_1.ManyToOne)(() => Role_1.Role, (role) => role.users),
    __metadata("design:type", Role_1.Role)
], User.prototype, "role", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], User.prototype, "branchId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Branch_1.Branch),
    (0, typeorm_1.ManyToOne)(() => Branch_1.Branch, (branch) => branch.users),
    __metadata("design:type", Branch_1.Branch)
], User.prototype, "branch", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Note_1.Note]),
    (0, typeorm_1.OneToMany)(() => Note_1.Note, (note) => note.creator),
    __metadata("design:type", Array)
], User.prototype, "notes", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Purchase_1.Purchase]),
    (0, typeorm_1.OneToMany)(() => Purchase_1.Purchase, (purchase) => purchase.creator),
    __metadata("design:type", Array)
], User.prototype, "createdPurchases", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Payment_1.Payment]),
    (0, typeorm_1.OneToMany)(() => Payment_1.Payment, (payment) => payment.creator),
    __metadata("design:type", Array)
], User.prototype, "createdPayments", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Purchase_1.Purchase]),
    (0, typeorm_1.OneToMany)(() => Purchase_1.Purchase, (purchase) => purchase.supplier),
    __metadata("design:type", Array)
], User.prototype, "suppliedPurchases", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ROR_1.ROR]),
    (0, typeorm_1.OneToMany)(() => ROR_1.ROR, (ROR) => ROR.creator),
    __metadata("design:type", Array)
], User.prototype, "RORS", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Attendance_1.Attendance]),
    (0, typeorm_1.OneToMany)(() => Attendance_1.Attendance, (attendance) => attendance.creator),
    __metadata("design:type", Array)
], User.prototype, "createdAttendances", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Attendance_1.Attendance]),
    (0, typeorm_1.OneToMany)(() => Attendance_1.Attendance, (attendance) => attendance.attendee),
    __metadata("design:type", Array)
], User.prototype, "attendances", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Payment_1.Payment]),
    (0, typeorm_1.OneToMany)(() => Payment_1.Payment, (payment) => payment.payer),
    __metadata("design:type", Array)
], User.prototype, "payments", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Payment_1.Payment]),
    (0, typeorm_1.OneToMany)(() => Payment_1.Payment, (payment) => payment.collector),
    __metadata("design:type", Array)
], User.prototype, "collections", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [IncentiveSheet_1.IncentiveSheet]),
    (0, typeorm_1.ManyToMany)(() => IncentiveSheet_1.IncentiveSheet, (IS) => IS.users),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "sheet", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "sheetId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "incentive", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Incentive_1.Incentive]),
    (0, typeorm_1.OneToMany)(() => Incentive_1.Incentive, (incentive) => incentive.staff),
    __metadata("design:type", Array)
], User.prototype, "incentives", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Sale_1.Sale]),
    (0, typeorm_1.OneToMany)(() => Sale_1.Sale, (sale) => sale.client),
    __metadata("design:type", Array)
], User.prototype, "servedSales", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Sale_1.Sale]),
    (0, typeorm_1.OneToMany)(() => Sale_1.Sale, (sale) => sale.creator),
    __metadata("design:type", Array)
], User.prototype, "createdSales", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Expense_1.Expense]),
    (0, typeorm_1.OneToMany)(() => Expense_1.Expense, (xpense) => xpense.creator),
    __metadata("design:type", Array)
], User.prototype, "createdExpenses", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Sale_1.Sale]),
    (0, typeorm_1.OneToMany)(() => Sale_1.Sale, (sale) => sale.seller),
    __metadata("design:type", Array)
], User.prototype, "initiatedSales", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Expense_1.Expense]),
    (0, typeorm_1.OneToMany)(() => Expense_1.Expense, (expense) => expense.authorizer),
    __metadata("design:type", Array)
], User.prototype, "authorizedExpenses", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Expense_1.Expense]),
    (0, typeorm_1.OneToMany)(() => Expense_1.Expense, (expense) => expense.staff),
    __metadata("design:type", Array)
], User.prototype, "receivedExpenses", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Account_1.Account]),
    (0, typeorm_1.OneToMany)(() => Account_1.Account, (Account) => Account.creator),
    __metadata("design:type", Array)
], User.prototype, "createdAccounts", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Asset_1.Asset]),
    (0, typeorm_1.OneToMany)(() => Asset_1.Asset, (Asset) => Asset.creator),
    __metadata("design:type", Array)
], User.prototype, "createdAssets", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [IncentiveSheet_1.IncentiveSheet]),
    (0, typeorm_1.OneToMany)(() => IncentiveSheet_1.IncentiveSheet, (IncentiveSheet) => IncentiveSheet.creator),
    __metadata("design:type", Array)
], User.prototype, "createdIncentiveSheets", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Product_1.Product]),
    (0, typeorm_1.OneToMany)(() => Product_1.Product, (Product) => Product.creator),
    __metadata("design:type", Array)
], User.prototype, "createdProducts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "halisia" }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
User = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map