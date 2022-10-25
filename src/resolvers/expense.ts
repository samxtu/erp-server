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
import { Expense } from "../entities/Expense";
import { BooleanResponse } from "./branch";
import { getConnection } from "typeorm";
import { Account } from "../entities/Account";

@InputType()
class ExpenseInput {
  @Field()
  expenseDate: string;
  @Field()
  title: string;
  @Field()
  details: string;
  @Field()
  authorizerId: number;
  @Field()
  staffId: number;
  @Field({nullable: true})
  assetId: number;
  @Field(() => Float)
  ammount: number;
  @Field()
  accountId: number;
  @Field()
  type: "staff" | "normal" | "asset";
}

@Resolver(Expense)
export class ExpenseResolver {
  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async addExpense(
    @Arg("args", () => ExpenseInput) args: ExpenseInput,
    @Ctx() { req }: MyContext
  ): Promise<BooleanResponse> {
    if (args.ammount === 0)
      return {
        status: false,
        error: {
          target: "general",
          message: "expense ammount can not be zero!",
        },
      };
    try {
      getConnection().transaction(async () => {
        const acc = await Account.findOne(args.accountId);
        if (!acc) throw new Error("Account does not exist!");
        acc.balance = acc.balance - args.ammount;
        await acc.save();
        await Expense.create({
          ...args,
          creatorId: req.session.userId,
        }).save();
      });
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
  async editExpense(
    @Arg("id") id: number,
    @Arg("args", () => ExpenseInput) args: ExpenseInput
  ): Promise<BooleanResponse> {
    if (args.ammount === 0)
      return {
        status: false,
        error: {
          target: "general",
          message: "expense ammount can not be zero!",
        },
      };
    const xpense = await Expense.findOne(id);
    if (!xpense)
      return {
        status: false,
        error: { target: "general", message: "Expense does not exist!" },
      };
    try {
      getConnection().transaction(async () => {
        if (xpense.ammount !== args.ammount) {
          const acc = await Account.findOne(args.accountId);
          if (!acc) throw new Error("Account has been removed!");
          acc.balance = acc.balance + xpense.ammount - args.ammount;
          await acc.save();
        }
        await Expense.update({ id }, { ...args });
      });
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
  async deleteExpense(@Arg("id") id: number): Promise<BooleanResponse> {
    const xpense = await Expense.findOne(id);
    if (!xpense)
      return {
        status: false,
        error: { target: "general", message: "Expense does not exist!" },
      };
    const acc = await Account.findOne(xpense.accountId);
    if (!acc)
      return {
        status: false,
        error: {
          target: "general",
          message: "Account used in this expense does not exist!",
        },
      };
    try {
      getConnection().transaction(async () => {
        acc.balance = acc.balance + xpense.ammount;
        acc.save();
        await Expense.delete(xpense.id);
      });
    } catch (err) {
      console.error(err.message);
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Query(() => [Expense])
  async getExpenses(): Promise<Expense[]> {
    let reqRes: Expense[] = await Expense.find({
      relations: ["authorizer", "staff", "account"],
      order: { expenseDate: "DESC" },
    });
    return reqRes;
  }

  @Query(() => Expense, { nullable: true })
  getExpense(@Arg("id") id: number): Promise<Expense | undefined> {
    return Expense.findOne(id, {
      relations: ["authorizer", "staff", "asset", "account", "creator"],
    });
  }
}
