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
exports.PurchaseResolver = void 0;
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const Purchase_1 = require("../entities/Purchase");
const branch_1 = require("./branch");
const typeorm_1 = require("typeorm");
const Account_1 = require("../entities/Account");
const Product_1 = require("../entities/Product");
let PurchaseInput = class PurchaseInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PurchaseInput.prototype, "purchaseDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PurchaseInput.prototype, "supplierId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PurchaseInput.prototype, "productId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PurchaseInput.prototype, "quantity", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], PurchaseInput.prototype, "purchasePrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], PurchaseInput.prototype, "sellingPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], PurchaseInput.prototype, "pieceSellingPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PurchaseInput.prototype, "receipt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PurchaseInput.prototype, "accountId", void 0);
PurchaseInput = __decorate([
    (0, type_graphql_1.InputType)()
], PurchaseInput);
let PurchaseResolver = class PurchaseResolver {
    addPurchase(args, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.purchasePrice === 0 ||
                args.quantity === 0 ||
                args.sellingPrice === 0)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "Fields can not be zero!",
                    },
                };
            try {
                (0, typeorm_1.getConnection)().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const acc = yield Account_1.Account.findOne(args.accountId);
                    if (!acc)
                        throw new Error("Account does not exist!");
                    acc.balance = acc.balance - args.purchasePrice * args.quantity;
                    yield acc.save();
                    const prod = yield Product_1.Product.findOne(args.productId);
                    if (!prod)
                        throw new Error("Product does not exist!");
                    prod.stock = prod.stock + args.quantity;
                    prod.sellingPrice = args.sellingPrice;
                    prod.pieceSellingPrice = args.pieceSellingPrice;
                    yield prod.save();
                    yield Purchase_1.Purchase.create(Object.assign(Object.assign({}, args), { creatorId: req.session.userId })).save();
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
    editPurchase(id, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.purchasePrice === 0 ||
                args.quantity === 0 ||
                args.sellingPrice === 0)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "Fields can not be zero!",
                    },
                };
            const purchase = yield Purchase_1.Purchase.findOne(id);
            if (!purchase)
                return {
                    status: false,
                    error: { target: "general", message: "Purchase does not exist!" },
                };
            try {
                (0, typeorm_1.getConnection)().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const acc = yield Account_1.Account.findOne(args.accountId);
                    if (!acc)
                        throw new Error("Account does not exist!");
                    acc.balance =
                        acc.balance +
                            purchase.purchasePrice * purchase.quantity -
                            args.purchasePrice * args.quantity;
                    yield acc.save();
                    const prod = yield Product_1.Product.findOne(args.productId);
                    if (!prod)
                        throw new Error("Product does not exist!");
                    prod.stock = prod.stock - purchase.quantity + args.quantity;
                    prod.sellingPrice = args.sellingPrice;
                    prod.pieceSellingPrice = args.pieceSellingPrice;
                    yield prod.save();
                    yield Purchase_1.Purchase.update({ id }, Object.assign({}, args));
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
    deletePurchase(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let oldSellingPrice;
            let oldPieceSellingPrice;
            const oldPurchases = yield Purchase_1.Purchase.find({
                order: { id: "DESC" },
                take: 2,
            });
            const purchase = yield Purchase_1.Purchase.findOne(id);
            if (!purchase)
                return {
                    status: false,
                    error: { target: "general", message: "Purchase does not exist!" },
                };
            const acc = yield Account_1.Account.findOne(purchase.accountId);
            if (!acc)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "Account used in this Purchase does not exist!",
                    },
                };
            const prod = yield Product_1.Product.findOne(purchase.productId);
            if (!prod)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "Product acquired in this Purchase does not exist!",
                    },
                };
            if (prod.stock < purchase.quantity)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "Product acquired in this Purchase has been sold!",
                    },
                };
            if (oldPurchases[0].id === purchase.id) {
                oldSellingPrice = oldPurchases[1].sellingPrice;
                oldPieceSellingPrice = oldPurchases[1].pieceSellingPrice;
            }
            else {
                oldSellingPrice = prod.sellingPrice;
                oldPieceSellingPrice = prod.pieceSellingPrice;
            }
            try {
                (0, typeorm_1.getConnection)().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    acc.balance = acc.balance + purchase.purchasePrice * purchase.quantity;
                    yield acc.save();
                    prod.stock = prod.stock - purchase.quantity;
                    prod.sellingPrice = oldSellingPrice;
                    prod.pieceSellingPrice = oldPieceSellingPrice;
                    yield prod.save();
                    yield Purchase_1.Purchase.delete(purchase.id);
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
    getPurchases() {
        return __awaiter(this, void 0, void 0, function* () {
            let reqRes = yield Purchase_1.Purchase.find({
                relations: ["supplier", "product", "account"],
                order: { purchaseDate: "DESC" },
            });
            return reqRes;
        });
    }
    getPurchase(id) {
        return Purchase_1.Purchase.findOne(id, {
            relations: ["supplier", "product", "account", "creator"],
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("args", () => PurchaseInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PurchaseInput, Object]),
    __metadata("design:returntype", Promise)
], PurchaseResolver.prototype, "addPurchase", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("args", () => PurchaseInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, PurchaseInput]),
    __metadata("design:returntype", Promise)
], PurchaseResolver.prototype, "editPurchase", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PurchaseResolver.prototype, "deletePurchase", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Purchase_1.Purchase]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PurchaseResolver.prototype, "getPurchases", null);
__decorate([
    (0, type_graphql_1.Query)(() => Purchase_1.Purchase, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PurchaseResolver.prototype, "getPurchase", null);
PurchaseResolver = __decorate([
    (0, type_graphql_1.Resolver)(Purchase_1.Purchase)
], PurchaseResolver);
exports.PurchaseResolver = PurchaseResolver;
//# sourceMappingURL=purchase.js.map