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
exports.NoteResolver = void 0;
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const Note_1 = require("../entities/Note");
const branch_1 = require("./branch");
let NoteInput = class NoteInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], NoteInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], NoteInput.prototype, "details", void 0);
NoteInput = __decorate([
    (0, type_graphql_1.InputType)()
], NoteInput);
let NoteResolver = class NoteResolver {
    addNote(args, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Note_1.Note.create(Object.assign(Object.assign({}, args), { creatorId: req.session.userId })).save();
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
    editNote(id, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield Note_1.Note.findOne(id);
            if (!note)
                return {
                    status: false,
                    error: { target: "general", message: "Note does not exist!" },
                };
            try {
                yield Note_1.Note.update({ id }, Object.assign({}, args));
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
    deleteNote(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Note_1.Note.delete(id);
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
    getNotes(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqRes = yield Note_1.Note.find({
                where: { creatorId: user },
                order: { createdAt: "ASC" },
            });
            return reqRes;
        });
    }
    getNote(id) {
        return Note_1.Note.findOne(id);
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("args", () => NoteInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NoteInput, Object]),
    __metadata("design:returntype", Promise)
], NoteResolver.prototype, "addNote", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("args", () => NoteInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, NoteInput]),
    __metadata("design:returntype", Promise)
], NoteResolver.prototype, "editNote", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => branch_1.BooleanResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NoteResolver.prototype, "deleteNote", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Note_1.Note]),
    __param(0, (0, type_graphql_1.Arg)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NoteResolver.prototype, "getNotes", null);
__decorate([
    (0, type_graphql_1.Query)(() => Note_1.Note, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NoteResolver.prototype, "getNote", null);
NoteResolver = __decorate([
    (0, type_graphql_1.Resolver)(Note_1.Note)
], NoteResolver);
exports.NoteResolver = NoteResolver;
//# sourceMappingURL=note.js.map