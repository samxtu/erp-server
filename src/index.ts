import "reflect-metadata";
import { createConnection } from "typeorm";
import {
  COOKIE_NAME,
  customSecret,
  DB_NAME,
  DB_PASSWORD,
  DB_TYPE,
  DB_USER,
  FRONT_END_ORIGIN,
  __prod__,
} from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/User";
import Redis from "ioredis";
const session = require("express-session");
import connectRedis from "connect-redis";
import cors from "cors";
import path from "path";
import { AccountResolver } from "./resolvers/account";
import { AssetResolver } from "./resolvers/asset";
import { AttendanceResolver } from "./resolvers/attendance";
import { BranchResolver } from "./resolvers/branch";
import { ExpenseResolver } from "./resolvers/expense";
import { IncentiveResolver } from "./resolvers/incentive";
import { NoteResolver } from "./resolvers/note";
import { PaymentResolver } from "./resolvers/payment";
import { ProductResolver } from "./resolvers/product";
import { PurchaseResolver } from "./resolvers/purchase";
import { RoleResolver } from "./resolvers/role";
import { RORResolver } from "./resolvers/ror";
import { SaleResolver } from "./resolvers/sale";
import { RegionsResolver } from "./resolvers/region";
import { FileResolver } from "./resolvers/uploadFile";

const main = async () => {
  const conn = await createConnection({
    type: DB_TYPE,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
    logging: true,
    synchronize: true, //never true in production
    entities: [path.join(__dirname, "./entities/*")],
    migrations: [path.join(__dirname, "./migrations/*")],
    cli: {
      migrationsDir: "./migrations",
    },
  });

  // await conn.runMigrations();

  console.log("Connected to db: ", conn.isConnected);
  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      secret: customSecret!,
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(
    cors({
      origin: FRONT_END_ORIGIN,
      credentials: true,
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        AccountResolver,
        AssetResolver,
        AttendanceResolver,
        BranchResolver,
        ExpenseResolver,
        IncentiveResolver,
        NoteResolver,
        PaymentResolver,
        ProductResolver,
        PurchaseResolver,
        RegionsResolver,
        RoleResolver,
        RORResolver,
        SaleResolver,
        FileResolver
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis, conn }),
  });
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000, () => {
    console.log("We are serving from express!!");
  });
};

main();
