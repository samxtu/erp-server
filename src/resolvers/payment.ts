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
import { Payment } from "../entities/Payment";
import { BooleanResponse } from "./branch";
import { getConnection } from "typeorm";
import { Account } from "../entities/Account";

@InputType()
class PaymentInput {
  @Field()
  paymentDate: string;
  @Field()
  details: string;
  @Field()
  payerId: number;
  @Field()
  collectorId: number;
  @Field(() => Float)
  ammount: number;
  @Field()
  accountId: number;
}

@Resolver(Payment)
export class PaymentResolver {
  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async addPayment(
    @Arg("args", () => PaymentInput) args: PaymentInput,
    @Ctx() { req }: MyContext
  ): Promise<BooleanResponse> {
    if (args.ammount === 0)
      return {
        status: false,
        error: {
          target: "general",
          message: "Payment ammount can not be zero!",
        },
      };
    try {
      getConnection().transaction(async () => {
        const acc = await Account.findOne(args.accountId);
        if (!acc) throw new Error("Account does not exist!");
        acc.balance = acc.balance + args.ammount;
        await acc.save();
        await Payment.create({
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
  async editPayment(
    @Arg("id") id: number,
    @Arg("args", () => PaymentInput) args: PaymentInput
  ): Promise<BooleanResponse> {
    if (args.ammount === 0)
      return {
        status: false,
        error: {
          target: "general",
          message: "Payment ammount can not be zero!",
        },
      };
    const payment = await Payment.findOne(id);
    if (!payment)
      return {
        status: false,
        error: { target: "general", message: "Payment does not exist!" },
      };
    try {
      getConnection().transaction(async () => {
        if (payment.ammount !== args.ammount) {
          const acc = await Account.findOne(args.accountId);
          if (!acc) throw new Error("Account has been removed!");
          acc.balance = acc.balance - payment.ammount + args.ammount;
          await acc.save();
        }
        await Payment.update({ id }, { ...args });
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
  async deletePayment(@Arg("id") id: number): Promise<BooleanResponse> {
    const payment = await Payment.findOne(id);
    if (!payment)
      return {
        status: false,
        error: { target: "general", message: "Payment does not exist!" },
      };
    const acc = await Account.findOne(payment.accountId);
    if (!acc)
      return {
        status: false,
        error: {
          target: "general",
          message: "Account used in this Payment does not exist!",
        },
      };
    try {
      getConnection().transaction(async () => {
        acc.balance = acc.balance - payment.ammount;
        acc.save();
        await Payment.delete(payment.id);
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

  @Query(() => [Payment])
  async getPayments(): Promise<Payment[]> {
    let reqRes: Payment[] = await Payment.find({
      relations: ["payer", "collector", "account"],
      order: { paymentDate: "DESC" },
    });
    return reqRes;
  }

  @Query(() => Payment, { nullable: true })
  getPayment(@Arg("id") id: number): Promise<Payment | undefined> {
    return Payment.findOne(id, {
      relations: ["payer", "collector", "account", "creator"],
    });
  }
}
