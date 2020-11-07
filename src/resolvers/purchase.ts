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
import { Purchase } from "../entities/Purchase";
import { BooleanResponse } from "./branch";
import { getConnection } from "typeorm";
import { Account } from "../entities/Account";
import { Product } from "../entities/Product";

@InputType()
class PurchaseInput {
  @Field()
  purchaseDate: string;
  @Field()
  supplierId: number;
  @Field()
  productId: number;
  @Field()
  quantity: number;
  @Field(() => Float)
  purchasePrice: number;
  @Field(() => Float)
  sellingPrice: number;
  @Field(() => Float)
  pieceSellingPrice: number;
  @Field()
  receipt: string;
  @Field()
  accountId: number;
}

@Resolver(Purchase)
export class PurchaseResolver {
  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async addPurchase(
    @Arg("args", () => PurchaseInput) args: PurchaseInput,
    @Ctx() { req }: MyContext
  ): Promise<BooleanResponse> {
    if (
      args.purchasePrice === 0 ||
      args.quantity === 0 ||
      args.sellingPrice === 0
    )
      return {
        status: false,
        error: {
          target: "general",
          message: "Fields can not be zero!",
        },
      };
    try {
      getConnection().transaction(async () => {
        const acc = await Account.findOne(args.accountId);
        if (!acc) throw new Error("Account does not exist!");
        acc.balance = acc.balance - args.purchasePrice * args.quantity;
        await acc.save();
        const prod = await Product.findOne(args.productId);
        if (!prod) throw new Error("Product does not exist!");
        prod.stock = prod.stock + args.quantity;
        prod.sellingPrice = args.sellingPrice;
        prod.pieceSellingPrice = args.pieceSellingPrice;
        await prod.save();
        await Purchase.create({
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
  async editPurchase(
    @Arg("id") id: number,
    @Arg("args", () => PurchaseInput) args: PurchaseInput
  ): Promise<BooleanResponse> {
    if (
      args.purchasePrice === 0 ||
      args.quantity === 0 ||
      args.sellingPrice === 0
    )
      return {
        status: false,
        error: {
          target: "general",
          message: "Fields can not be zero!",
        },
      };
    const purchase = await Purchase.findOne(id);
    if (!purchase)
      return {
        status: false,
        error: { target: "general", message: "Purchase does not exist!" },
      };
    try {
      getConnection().transaction(async () => {
        const acc = await Account.findOne(args.accountId);
        if (!acc) throw new Error("Account does not exist!");
        acc.balance =
          acc.balance +
          purchase.purchasePrice * purchase.quantity -
          args.purchasePrice * args.quantity;
        await acc.save();
        const prod = await Product.findOne(args.productId);
        if (!prod) throw new Error("Product does not exist!");
        prod.stock = prod.stock - purchase.quantity + args.quantity;
        prod.sellingPrice = args.sellingPrice;
        prod.pieceSellingPrice = args.pieceSellingPrice;
        await prod.save();
        await Purchase.update({ id }, { ...args });
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
  async deletePurchase(@Arg("id") id: number): Promise<BooleanResponse> {
    let oldSellingPrice: number;
    let oldPieceSellingPrice: number;
    const oldPurchases = await Purchase.find({
      order: { id: "DESC" },
      take: 2,
    });
    const purchase = await Purchase.findOne(id);
    if (!purchase)
      return {
        status: false,
        error: { target: "general", message: "Purchase does not exist!" },
      };
    const acc = await Account.findOne(purchase.accountId);
    if (!acc)
      return {
        status: false,
        error: {
          target: "general",
          message: "Account used in this Purchase does not exist!",
        },
      };
    const prod = await Product.findOne(purchase.productId);
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
    } else {
      oldSellingPrice = prod.sellingPrice;
      oldPieceSellingPrice = prod.pieceSellingPrice;
    }
    try {
      getConnection().transaction(async () => {
        acc.balance = acc.balance + purchase.purchasePrice * purchase.quantity;
        await acc.save();
        prod.stock = prod.stock - purchase.quantity;
        prod.sellingPrice = oldSellingPrice;
        prod.pieceSellingPrice = oldPieceSellingPrice;
        await prod.save();
        await Purchase.delete(purchase.id);
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

  @Query(() => [Purchase])
  async getPurchases(): Promise<Purchase[]> {
    let reqRes: Purchase[] = await Purchase.find({
      relations: ["supplier", "product", "account"],
      order: { purchaseDate: "DESC" },
    });
    return reqRes;
  }

  @Query(() => Purchase, { nullable: true })
  getPurchase(@Arg("id") id: number): Promise<Purchase | undefined> {
    return Purchase.findOne(id, {
      relations: ["supplier", "product", "account", "creator"],
    });
  }
}
