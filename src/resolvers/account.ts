import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import {
  Arg,
  Mutation,
  Resolver,
  Ctx,
  UseMiddleware,
  Field,
  InputType,
  Query,
  Float,
} from "type-graphql";
import { Account } from "../entities/Account";
import { BooleanResponse } from "./branch";

@InputType()
class AccountInput {
  @Field()
  name: string;
  @Field()
  number: string;
  @Field()
  branchId: number;
  @Field(() => Float)
  balance: number;
}

@Resolver(Account)
export class AccountResolver {
  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async addAccount(
    @Arg("args") args: AccountInput,
    @Ctx() { req }: MyContext
  ): Promise<BooleanResponse> {
    if (!args.name || args.name === "")
      return {
        status: false,
        error: { target: "name", message: "Name can not be empty!" },
      };
    try {
      await Account.create({ ...args, creatorId: req.session.userId }).save();
    } catch (err) {
      console.error(err.message);
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async editAccount(
    @Arg("id") id: number,
    @Arg("args") args: AccountInput
  ): Promise<BooleanResponse> {
    if (!args.name || args.name === "")
      return {
        status: false,
        error: { target: "name", message: "Name can not be empty!" },
      };
    const account = await Account.findOne(id);
    if (!account)
      return {
        status: false,
        error: { target: "general", message: "Account does not exist!" },
      };
    try {
      await Account.update({ id }, { ...args });
    } catch (err) {
      console.error(err.message);
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async changeAmmount(
    @Arg("id") id: number,
    @Arg("ammount", () => Float) ammount: number
  ): Promise<BooleanResponse> {
    if (ammount === 0)
      return {
        status: false,
        error: { target: "ammount", message: "Ammount required!" },
      };
    const account = await Account.findOne(id);
    if (!account)
      return {
        status: false,
        error: { target: "general", message: "Account does not exist!" },
      };
    try {
      account.balance = account.balance + ammount;
      await account.save();
    } catch (err) {
      console.error(err.message);
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async deleteAccount(@Arg("id") id: number): Promise<BooleanResponse> {
    try {
      await Account.delete(id);
    } catch (err) {
      console.error(err.message);
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Query(() => [Account])
  async getAccounts(@Arg("branch") branch: number): Promise<Account[]> {
    let reqRes: Account[];
    if (branch) reqRes = await Account.find({ where: { branchId: branch } });
    else reqRes = await Account.find();
    return reqRes;
  }

  @Query(() => Account, { nullable: true })
  getAccount(@Arg("id") id: number): Promise<Account | undefined> {
    return Account.findOne(id, {
      relations: ["payments", "sales", "purchases", "expenses", "creator"],
    });
  }
}
