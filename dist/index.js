"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const constants_1 = require("./constants");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./resolvers/User");
const ioredis_1 = __importDefault(require("ioredis"));
const session = require("express-session");
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const account_1 = require("./resolvers/account");
const asset_1 = require("./resolvers/asset");
const attendance_1 = require("./resolvers/attendance");
const branch_1 = require("./resolvers/branch");
const expense_1 = require("./resolvers/expense");
const incentive_1 = require("./resolvers/incentive");
const note_1 = require("./resolvers/note");
const payment_1 = require("./resolvers/payment");
const product_1 = require("./resolvers/product");
const purchase_1 = require("./resolvers/purchase");
const role_1 = require("./resolvers/role");
const ror_1 = require("./resolvers/ror");
const sale_1 = require("./resolvers/sale");
const region_1 = require("./resolvers/region");
const uploadFile_1 = require("./resolvers/uploadFile");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield (0, typeorm_1.createConnection)({
        type: constants_1.DB_TYPE,
        database: constants_1.DB_NAME,
        username: constants_1.DB_USER,
        password: constants_1.DB_PASSWORD,
        logging: true,
        synchronize: true,
        entities: [path_1.default.join(__dirname, "./entities/*")],
        migrations: [path_1.default.join(__dirname, "./migrations/*")],
        cli: {
            migrationsDir: "./migrations",
        },
    });
    console.log("Connected to db: ", conn.isConnected);
    const app = (0, express_1.default)();
    const RedisStore = (0, connect_redis_1.default)(session);
    const redis = new ioredis_1.default();
    app.use(session({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
        },
        secret: constants_1.customSecret,
        resave: false,
        saveUninitialized: true,
    }));
    app.use((0, cors_1.default)({
        origin: constants_1.FRONT_END_ORIGIN,
        credentials: true,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [
                User_1.UserResolver,
                account_1.AccountResolver,
                asset_1.AssetResolver,
                attendance_1.AttendanceResolver,
                branch_1.BranchResolver,
                expense_1.ExpenseResolver,
                incentive_1.IncentiveResolver,
                note_1.NoteResolver,
                payment_1.PaymentResolver,
                product_1.ProductResolver,
                purchase_1.PurchaseResolver,
                region_1.RegionsResolver,
                role_1.RoleResolver,
                ror_1.RORResolver,
                sale_1.SaleResolver,
                uploadFile_1.FileResolver
            ],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res, redis, conn }),
    });
    apolloServer.applyMiddleware({ app, cors: false });
    app.listen(4000, () => {
        console.log("We are serving from express!!");
    });
});
main();
//# sourceMappingURL=index.js.map