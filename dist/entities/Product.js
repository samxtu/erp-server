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
exports.Product = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Incentive_1 = require("./Incentive");
const IncentiveSheet_1 = require("./IncentiveSheet");
const Purchase_1 = require("./Purchase");
const Sale_1 = require("./Sale");
const User_1 = require("./User");
let Product = class Product extends typeorm_1.BaseEntity {
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
], Product.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Object)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Object)
], Product.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Product.prototype, "creatorId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.createdProducts),
    __metadata("design:type", User_1.User)
], Product.prototype, "creator", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "unit", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "pieceUnit", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Product.prototype, "pieces", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Purchase_1.Purchase]),
    (0, typeorm_1.OneToMany)(() => Purchase_1.Purchase, (purchase) => purchase.product),
    __metadata("design:type", Array)
], Product.prototype, "purchases", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [IncentiveSheet_1.IncentiveSheet]),
    (0, typeorm_1.OneToMany)(() => IncentiveSheet_1.IncentiveSheet, (IS) => IS.product),
    __metadata("design:type", Array)
], Product.prototype, "incentiveSheets", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Incentive_1.Incentive]),
    (0, typeorm_1.OneToMany)(() => Incentive_1.Incentive, (IS) => IS.product),
    __metadata("design:type", Array)
], Product.prototype, "incentives", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Sale_1.Sale]),
    (0, typeorm_1.OneToMany)(() => Sale_1.Sale, (sale) => sale.product),
    __metadata("design:type", Array)
], Product.prototype, "sold", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "pieceStock", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "bigint", default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "sellingPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "pieceSellingPrice", void 0);
Product = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Product);
exports.Product = Product;
//# sourceMappingURL=Product.js.map