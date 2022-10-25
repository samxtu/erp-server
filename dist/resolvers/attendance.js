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
exports.AttendanceResolver = void 0;
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const Attendance_1 = require("../entities/Attendance");
const branch_1 = require("./branch");
const typeorm_1 = require("typeorm");
let AttendanceInput = class AttendanceInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AttendanceInput.prototype, "arrivedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], AttendanceInput.prototype, "attended", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], AttendanceInput.prototype, "attendeeId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AttendanceInput.prototype, "comment", void 0);
AttendanceInput = __decorate([
    (0, type_graphql_1.InputType)()
], AttendanceInput);
let AttendanceInputEdit = class AttendanceInputEdit {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AttendanceInputEdit.prototype, "arrivedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], AttendanceInputEdit.prototype, "attended", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AttendanceInputEdit.prototype, "comment", void 0);
AttendanceInputEdit = __decorate([
    (0, type_graphql_1.InputType)()
], AttendanceInputEdit);
let AttendanceResolver = class AttendanceResolver {
    addAttendance(attendees, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, typeorm_1.getConnection)().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    attendees.forEach((attendee) => __awaiter(this, void 0, void 0, function* () {
                        yield Attendance_1.Attendance.create(Object.assign(Object.assign({}, attendee), { creatorId: req.session.userId })).save();
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
    editAttendance(id, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args.arrivedAt)
                return {
                    status: false,
                    error: { target: "general", message: "arrival time can not be empty!" },
                };
            const attendance = yield Attendance_1.Attendance.findOne(id);
            if (!attendance)
                return {
                    status: false,
                    error: { target: "general", message: "Attendance does not exist!" },
                };
            try {
                yield Attendance_1.Attendance.update({ id }, Object.assign({}, args));
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
    getAttendances(branch, start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqRes;
            if (branch)
                reqRes = yield Attendance_1.Attendance.find({
                    where: { arrivedAt: (0, typeorm_1.Between)(start, end) },
                    order: { arrivedAt: "ASC" },
                    relations: ["attendee"],
                });
            else
                reqRes = yield Attendance_1.Attendance.find();
            return reqRes;
        });
    }
    getAttendance(id, start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            const att = yield Attendance_1.Attendance.find({
                where: {
                    attendeeId: id,
                    arrivedAt: (0, typeorm_1.Between)(start, end),
                },
                relations: ["attendee", "creator"],
                order: {
                    arrivedAt: "ASC",
                },
            });
            return att;
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("attendees", () => [AttendanceInput])),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], AttendanceResolver.prototype, "addAttendance", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("args", () => AttendanceInputEdit)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, AttendanceInputEdit]),
    __metadata("design:returntype", Promise)
], AttendanceResolver.prototype, "editAttendance", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Attendance_1.Attendance]),
    __param(0, (0, type_graphql_1.Arg)("branch")),
    __param(1, (0, type_graphql_1.Arg)("start")),
    __param(2, (0, type_graphql_1.Arg)("end")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Date,
        Date]),
    __metadata("design:returntype", Promise)
], AttendanceResolver.prototype, "getAttendances", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Attendance_1.Attendance]),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("start")),
    __param(2, (0, type_graphql_1.Arg)("end")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Date,
        Date]),
    __metadata("design:returntype", Promise)
], AttendanceResolver.prototype, "getAttendance", null);
AttendanceResolver = __decorate([
    (0, type_graphql_1.Resolver)(Attendance_1.Attendance)
], AttendanceResolver);
exports.AttendanceResolver = AttendanceResolver;
//# sourceMappingURL=attendance.js.map