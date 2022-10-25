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
exports.IncentiveResolver = void 0;
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const IncentiveSheet_1 = require("../entities/IncentiveSheet");
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Incentive_1 = require("../entities/Incentive");
const branch_1 = require("./branch");
let IncentiveInput = class IncentiveInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], IncentiveInput.prototype, "productId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], IncentiveInput.prototype, "incentivePrice", void 0);
IncentiveInput = __decorate([
    (0, type_graphql_1.InputType)()
], IncentiveInput);
let SheetInput = class SheetInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], SheetInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], SheetInput.prototype, "state", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], SheetInput.prototype, "startDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], SheetInput.prototype, "endDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [type_graphql_1.Int]),
    __metadata("design:type", Array)
], SheetInput.prototype, "staff", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [IncentiveInput]),
    __metadata("design:type", Array)
], SheetInput.prototype, "productsIncentives", void 0);
SheetInput = __decorate([
    (0, type_graphql_1.InputType)()
], SheetInput);
let IncentiveResolver = class IncentiveResolver {
    addSheet(args, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, startDate, endDate, state, staff, productsIncentives } = args;
            const sheetNo = new Date().getTime();
            try {
                (0, typeorm_1.getConnection)().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const users = yield User_1.User.findByIds(staff);
                    users.forEach((u) => __awaiter(this, void 0, void 0, function* () {
                        u.sheetId = sheetNo;
                        u.incentive = true;
                        yield u.save();
                    }));
                    productsIncentives.forEach((pi) => __awaiter(this, void 0, void 0, function* () {
                        yield IncentiveSheet_1.IncentiveSheet.create(Object.assign(Object.assign({}, pi), { startDate,
                            endDate,
                            name,
                            sheetNo,
                            state, creatorId: req.session.userId })).save();
                    }));
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
    editSheet(sheetNo, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, startDate, state, endDate, staff, productsIncentives } = args;
            try {
                (0, typeorm_1.getConnection)().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const users = yield User_1.User.findByIds(staff);
                    users.forEach((u) => __awaiter(this, void 0, void 0, function* () {
                        u.sheetId = sheetNo;
                        u.incentive = true;
                        yield u.save();
                    }));
                    productsIncentives.forEach((pi) => __awaiter(this, void 0, void 0, function* () {
                        const IS = yield IncentiveSheet_1.IncentiveSheet.findOne({
                            where: { productId: pi.productId, sheetNo: sheetNo },
                        });
                        if (!IS)
                            return;
                        IS.name = name;
                        IS.startDate = startDate;
                        IS.endDate = endDate;
                        IS.state = state;
                        IS.incentivePrice = pi.incentivePrice;
                        yield IS.save();
                    }));
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
    deleteSheet(sheetNo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, typeorm_1.getConnection)().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const users = yield User_1.User.find({ where: { sheetId: sheetNo } });
                    if (users.length > 0)
                        throw new Error("Sheet actively used by staff!");
                    yield (0, typeorm_1.getConnection)()
                        .createQueryBuilder()
                        .delete()
                        .from(IncentiveSheet_1.IncentiveSheet)
                        .where('"sheetNo" = :id', { id: sheetNo })
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
    getIncentives(start, end, staff) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqRes;
            if (staff)
                reqRes = yield Incentive_1.Incentive.find({
                    where: {
                        staffId: staff,
                        createdAt: (0, typeorm_1.Between)(start, end),
                    },
                    relations: ["staff", "product", "sale"],
                });
            else
                reqRes = yield Incentive_1.Incentive.find({
                    where: {
                        createdAt: (0, typeorm_1.Between)(start, end),
                    },
                    order: { staffId: "ASC" },
                    relations: ["staff", "product", "sale"],
                });
            return reqRes;
        });
    }
    getIncentiveSheets() {
        return IncentiveSheet_1.IncentiveSheet.find();
    }
    getIncentiveSheet(id) {
        return IncentiveSheet_1.IncentiveSheet.findOne({
            where: { sheetNo: id },
            relations: ["users", "product"],
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("args")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SheetInput, Object]),
    __metadata("design:returntype", Promise)
], IncentiveResolver.prototype, "addSheet", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("sheetNo")),
    __param(1, (0, type_graphql_1.Arg)("args")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, SheetInput]),
    __metadata("design:returntype", Promise)
], IncentiveResolver.prototype, "editSheet", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("sheetNo")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IncentiveResolver.prototype, "deleteSheet", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Incentive_1.Incentive]),
    __param(0, (0, type_graphql_1.Arg)("start")),
    __param(1, (0, type_graphql_1.Arg)("end")),
    __param(2, (0, type_graphql_1.Arg)("staff")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, Number]),
    __metadata("design:returntype", Promise)
], IncentiveResolver.prototype, "getIncentives", null);
__decorate([
    (0, type_graphql_1.Query)(() => [IncentiveSheet_1.IncentiveSheet]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IncentiveResolver.prototype, "getIncentiveSheets", null);
__decorate([
    (0, type_graphql_1.Query)(() => IncentiveSheet_1.IncentiveSheet, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IncentiveResolver.prototype, "getIncentiveSheet", null);
IncentiveResolver = __decorate([
    (0, type_graphql_1.Resolver)(IncentiveSheet_1.IncentiveSheet)
], IncentiveResolver);
exports.IncentiveResolver = IncentiveResolver;
//# sourceMappingURL=incentive.js.map