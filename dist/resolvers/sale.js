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
exports.SaleResolver = void 0;
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const Sale_1 = require("../entities/Sale");
const branch_1 = require("./branch");
const typeorm_1 = require("typeorm");
const Account_1 = require("../entities/Account");
const Product_1 = require("../entities/Product");
const User_1 = require("../entities/User");
const IncentiveSheet_1 = require("../entities/IncentiveSheet");
const Incentive_1 = require("../entities/Incentive");
let SaleInput = class SaleInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], SaleInput.prototype, "saleDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], SaleInput.prototype, "sellerId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], SaleInput.prototype, "clientId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], SaleInput.prototype, "productId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], SaleInput.prototype, "quantity", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], SaleInput.prototype, "pieceQuantity", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], SaleInput.prototype, "sellingPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], SaleInput.prototype, "pieceSellingPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], SaleInput.prototype, "payed", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], SaleInput.prototype, "accountId", void 0);
SaleInput = __decorate([
    (0, type_graphql_1.InputType)()
], SaleInput);
let SaleResolver = class SaleResolver {
    addSale(args, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let cred;
            let error = { target: undefined, message: "" };
            if ((args.sellingPrice === 0 && args.pieceSellingPrice === 0) ||
                (args.quantity === 0 && args.pieceQuantity === 0) ||
                (args.quantity === 0 && args.sellingPrice === 0) ||
                (args.pieceQuantity === 0 && args.pieceSellingPrice === 0))
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "Fields can not be zero!",
                    },
                };
            try {
                (0, typeorm_1.getConnection)().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const client = yield User_1.User.findOne(args.clientId);
                    if (!client)
                        throw new Error("Client does not exist!");
                    if (args.payed > 0) {
                        const acc = yield Account_1.Account.findOne(args.accountId);
                        if (!acc)
                            throw new Error("Account does not exist!");
                        acc.balance = acc.balance + args.payed;
                        yield acc.save();
                        if (args.payed !==
                            args.sellingPrice * args.quantity +
                                args.pieceSellingPrice * args.pieceQuantity) {
                            cred = args.payed -
                                args.sellingPrice * args.quantity +
                                args.pieceSellingPrice * args.pieceQuantity;
                            if (client.credit)
                                client.balance = client.balance + cred;
                            if (!client.credit) {
                                let diff = client.balance + cred;
                                client.credit = true;
                                client.balance = diff;
                                error = { target: "warning", message: "User credits activated!" };
                            }
                            yield client.save();
                        }
                    }
                    else {
                        cred =
                            args.sellingPrice * args.quantity +
                                args.pieceSellingPrice * args.pieceQuantity;
                        if (client.credit)
                            client.balance = client.balance + cred;
                        if (!client.credit) {
                            let diff = client.balance - cred;
                            if (diff < 0) {
                                client.balance = -diff;
                                client.credit = true;
                            }
                            else {
                                client.balance = diff;
                            }
                        }
                        yield client.save();
                    }
                    const prod = yield Product_1.Product.findOne(args.productId);
                    if (!prod)
                        throw new Error("Product does not exist!");
                    if (args.pieceQuantity > prod.pieces)
                        throw new Error(`${prod.pieces} ${prod.pieceUnit} means 1 ${prod.unit}`);
                    prod.stock = prod.stock - args.quantity;
                    if (args.pieceQuantity > 0) {
                        if (prod.pieceStock < args.pieceQuantity) {
                            prod.stock = prod.stock - 1;
                            prod.pieceStock = prod.pieceStock + prod.pieces;
                        }
                        prod.pieceStock = prod.pieceStock - args.pieceQuantity;
                    }
                    yield prod.save();
                    const sale = yield Sale_1.Sale.create(Object.assign(Object.assign({}, args), { creatorId: req.session.userId })).save();
                    const seller = yield User_1.User.findOne(args.sellerId);
                    if (seller && seller.incentive) {
                        const sht = yield IncentiveSheet_1.IncentiveSheet.findOne({
                            where: { sheetNo: seller.sheetId, productId: args.productId },
                        });
                        if (sht) {
                            yield Incentive_1.Incentive.create({
                                staffId: args.sellerId,
                                productId: args.productId,
                                saleId: sale.id,
                                quantity: args.quantity,
                                incentivePrice: sht.incentivePrice,
                            });
                        }
                    }
                }));
            }
            catch (err) {
                console.error(err.message);
                return {
                    status: false,
                    error: { target: "general", message: err.message },
                };
            }
            return { status: true, error: error };
        });
    }
    editSale(id, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let cred;
            if ((args.sellingPrice === 0 && args.pieceSellingPrice === 0) ||
                (args.quantity === 0 && args.pieceQuantity === 0) ||
                (args.quantity === 0 && args.sellingPrice === 0) ||
                (args.pieceQuantity === 0 && args.pieceSellingPrice === 0))
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "Fields can not be zero!",
                    },
                };
            const sale = yield Sale_1.Sale.findOne(id);
            if (!sale)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "Sale does not exist!",
                    },
                };
            if (sale.clientId !== args.clientId)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "You can not update this sale, try deleting and adding a new one!",
                    },
                };
            if (sale.productId !== args.productId)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "You can not update this sale, try deleting and adding a new one!",
                    },
                };
            try {
                (0, typeorm_1.getConnection)().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const client = yield User_1.User.findOne(sale.clientId);
                    if (!client)
                        throw new Error("Client does not exist!");
                    let oldCred;
                    if (args.payed > 0) {
                        const acc = yield Account_1.Account.findOne(args.accountId);
                        if (!acc)
                            throw new Error("Account does not exist!");
                        acc.balance = acc.balance - sale.payed + args.payed;
                        yield acc.save();
                        if (args.payed !==
                            args.sellingPrice * args.quantity +
                                args.pieceSellingPrice * args.pieceQuantity) {
                            cred =
                                args.sellingPrice * args.quantity +
                                    args.pieceSellingPrice * args.pieceQuantity -
                                    args.payed;
                            if (client.credit) {
                                oldCred =
                                    sale.sellingPrice * sale.quantity +
                                        sale.pieceSellingPrice * sale.pieceQuantity -
                                        sale.payed;
                                if (client.balance > oldCred)
                                    client.balance = client.balance - oldCred + cred;
                                else {
                                    client.balance = -(client.balance - oldCred);
                                    client.credit = false;
                                }
                            }
                            if (!client.credit) {
                                if (oldCred) {
                                    let diff = client.balance - cred;
                                    if (diff < 0) {
                                        client.balance = -diff;
                                        client.credit = true;
                                    }
                                    else {
                                        client.balance = diff;
                                    }
                                }
                                else {
                                    oldCred =
                                        sale.sellingPrice * sale.quantity +
                                            sale.pieceSellingPrice * sale.pieceQuantity -
                                            sale.payed;
                                    let dif = client.balance + oldCred - cred;
                                    if (dif < 0) {
                                        client.balance = -dif;
                                        client.credit = true;
                                    }
                                    else {
                                        client.balance = dif;
                                    }
                                }
                            }
                            yield client.save();
                        }
                    }
                    else {
                        oldCred =
                            sale.sellingPrice * sale.quantity +
                                sale.pieceSellingPrice * sale.pieceQuantity -
                                sale.payed;
                        cred =
                            args.sellingPrice * args.quantity +
                                args.pieceSellingPrice * args.pieceQuantity;
                        if (client.credit) {
                            if (client.balance > oldCred)
                                client.balance = client.balance + cred - oldCred;
                            else if (client.balance + cred > oldCred) {
                                client.balance = client.balance + cred - oldCred;
                            }
                            else {
                                client.balance = -(client.balance + cred - oldCred);
                                client.credit = false;
                            }
                        }
                        if (!client.credit) {
                            let diff = client.balance - cred + oldCred;
                            if (diff < 0) {
                                client.balance = -diff;
                                client.credit = true;
                            }
                            else {
                                client.balance = diff;
                            }
                        }
                        yield client.save();
                    }
                    const prod = yield Product_1.Product.findOne(args.productId);
                    if (!prod)
                        throw new Error("Product does not exist!");
                    if (args.pieceQuantity > prod.pieces)
                        throw new Error(`${prod.pieces} ${prod.pieceUnit} means 1 ${prod.unit}`);
                    prod.stock = prod.stock - args.quantity + sale.quantity;
                    if (args.pieceQuantity > 0) {
                        if (prod.pieceStock < args.pieceQuantity) {
                            prod.stock = prod.stock - 1;
                            prod.pieceStock = prod.pieceStock + prod.pieces;
                        }
                        prod.pieceStock =
                            prod.pieceStock - args.pieceQuantity + sale.pieceQuantity;
                    }
                    yield prod.save();
                    yield Sale_1.Sale.update({ id }, Object.assign({}, args));
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
    deleteSale(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sale = yield Sale_1.Sale.findOne(id);
            let oldCred;
            if (!sale)
                return {
                    status: false,
                    error: { target: "general", message: "Sale does not exist!" },
                };
            const prod = yield Product_1.Product.findOne(sale.productId);
            if (!prod)
                return {
                    status: false,
                    error: {
                        target: "general",
                        message: "Product acquired in this Sale does not exist!",
                    },
                };
            try {
                (0, typeorm_1.getConnection)().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    if (sale.payed > 0) {
                        const acc = yield Account_1.Account.findOne(sale.accountId);
                        if (!acc)
                            throw new Error("Account does not exist!");
                        acc.balance = acc.balance - sale.payed;
                        yield acc.save();
                    }
                    prod.stock = prod.stock + sale.quantity;
                    prod.pieceStock = prod.pieceStock + sale.pieceQuantity;
                    yield prod.save();
                    if (sale.payed !==
                        sale.sellingPrice * sale.quantity +
                            sale.pieceSellingPrice * sale.pieceQuantity) {
                        const client = yield User_1.User.findOne(sale.clientId);
                        if (!client)
                            throw new Error("Client does not exist!");
                        oldCred =
                            sale.sellingPrice * sale.quantity +
                                sale.pieceSellingPrice * sale.pieceQuantity -
                                sale.payed;
                        if (client.balance > oldCred) {
                            if (client.credit) {
                                client.balance = client.balance - oldCred;
                            }
                            else if (!client.credit) {
                                client.balance = client.balance + oldCred;
                            }
                        }
                        else if (client.balance < oldCred) {
                            if (client.credit) {
                                client.balance = -(client.balance - oldCred);
                                client.credit = !client.credit;
                            }
                            else if (!client.credit) {
                                client.balance = client.balance + oldCred;
                            }
                        }
                        yield client.save();
                    }
                    yield Sale_1.Sale.delete(id);
                    yield (0, typeorm_1.getConnection)()
                        .createQueryBuilder()
                        .delete()
                        .from(Incentive_1.Incentive)
                        .where('"saleId" = :id', { id: id })
                        .execute();
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
    getSales() {
        return __awaiter(this, void 0, void 0, function* () {
            let reqRes = yield Sale_1.Sale.find({
                relations: ["client", "product", "seller", "account"],
                order: { saleDate: "DESC" },
            });
            return reqRes;
        });
    }
    getSale(id) {
        return Sale_1.Sale.findOne(id, {
            relations: ["client", "product", "seller", "account", "creator"],
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("args", () => SaleInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SaleInput, Object]),
    __metadata("design:returntype", Promise)
], SaleResolver.prototype, "addSale", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("args", () => SaleInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, SaleInput]),
    __metadata("design:returntype", Promise)
], SaleResolver.prototype, "editSale", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SaleResolver.prototype, "deleteSale", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Sale_1.Sale]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SaleResolver.prototype, "getSales", null);
__decorate([
    (0, type_graphql_1.Query)(() => Sale_1.Sale, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SaleResolver.prototype, "getSale", null);
SaleResolver = __decorate([
    (0, type_graphql_1.Resolver)(Sale_1.Sale)
], SaleResolver);
exports.SaleResolver = SaleResolver;
//# sourceMappingURL=sale.js.map