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
import { Sale } from "../entities/Sale";
import { BooleanResponse } from "./branch";
import { getConnection } from "typeorm";
import { Account } from "../entities/Account";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { IncentiveSheet } from "../entities/IncentiveSheet";
import { Incentive } from "../entities/Incentive";

@InputType()
class SaleInput {
  @Field()
  saleDate: string;
  @Field()
  sellerId: number;
  @Field()
  clientId: number;
  @Field()
  productId: number;
  @Field()
  quantity: number;
  @Field()
  pieceQuantity: number;
  @Field(() => Float)
  sellingPrice: number;
  @Field(() => Float)
  pieceSellingPrice: number;
  @Field(() => Float)
  payed: number;
  @Field()
  accountId: number;
}

@Resolver(Sale)
export class SaleResolver {
  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async addSale(
    @Arg("args", () => SaleInput) args: SaleInput,
    @Ctx() { req }: MyContext
  ): Promise<BooleanResponse> {
    let cred: number;
    if (
      (args.sellingPrice === 0 && args.pieceSellingPrice === 0) ||
      (args.quantity === 0 && args.pieceQuantity === 0) ||
      (args.quantity === 0 && args.sellingPrice === 0) ||
      (args.pieceQuantity === 0 && args.pieceSellingPrice === 0)
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
        const client = await User.findOne(args.clientId);
        if (!client) throw new Error("Client does not exist!");
        if (args.payed > 0) {
          const acc = await Account.findOne(args.accountId);
          if (!acc) throw new Error("Account does not exist!");
          acc.balance = acc.balance + args.payed;
          await acc.save();
          if (
            args.payed !==
            args.sellingPrice * args.quantity +
              args.pieceSellingPrice * args.pieceQuantity
          ) {
            cred =
              args.sellingPrice * args.quantity +
              args.pieceSellingPrice * args.pieceQuantity -
              args.payed;
            if (client.credit) client.balance = client.balance + cred;
            if (!client.credit) {
              let diff = client.balance - cred;
              if (diff < 0) {
                client.balance = -diff;
                client.credit = true;
              } else {
                client.balance = diff;
              }
            }
            await client.save();
          }
        } else {
          cred =
            args.sellingPrice * args.quantity +
            args.pieceSellingPrice * args.pieceQuantity;
          if (client.credit) client.balance = client.balance + cred;
          if (!client.credit) {
            let diff = client.balance - cred;
            if (diff < 0) {
              client.balance = -diff;
              client.credit = true;
            } else {
              client.balance = diff;
            }
          }
          await client.save();
        }
        const prod = await Product.findOne(args.productId);
        if (!prod) throw new Error("Product does not exist!");
        if (args.pieceQuantity > prod.pieces)
          throw new Error(
            `${prod.pieces} ${prod.pieceUnit} means 1 ${prod.unit}`
          );
        prod.stock = prod.stock - args.quantity;
        if (args.pieceQuantity > 0) {
          if (prod.pieceStock < args.pieceQuantity) {
            prod.stock = prod.stock - 1;
            prod.pieceStock = prod.pieceStock + prod.pieces;
          }
          prod.pieceStock = prod.pieceStock - args.pieceQuantity;
        }
        await prod.save();
        const sale = await Sale.create({
          ...args,
          creatorId: req.session.userId,
        }).save();
        const seller = await User.findOne(args.sellerId);
        if (seller && seller.incentive) {
          const sht = await IncentiveSheet.findOne({
            where: { sheetNo: seller.sheetId, productId: args.productId },
          });
          if (sht) {
            await Incentive.create({
              staffId: args.sellerId,
              productId: args.productId,
              saleId: sale.id,
              quantity: args.quantity,
              incentivePrice: sht.incentivePrice,
            });
          }
        }
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
  async editSale(
    @Arg("id") id: number,
    @Arg("args", () => SaleInput) args: SaleInput
  ): Promise<BooleanResponse> {
    let cred: number;
    if (
      (args.sellingPrice === 0 && args.pieceSellingPrice === 0) ||
      (args.quantity === 0 && args.pieceQuantity === 0) ||
      (args.quantity === 0 && args.sellingPrice === 0) ||
      (args.pieceQuantity === 0 && args.pieceSellingPrice === 0)
    )
      return {
        status: false,
        error: {
          target: "general",
          message: "Fields can not be zero!",
        },
      };
    const sale = await Sale.findOne(id);
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
          message:
            "You can not update this sale, try deleting and adding a new one!",
        },
      };
    if (sale.productId !== args.productId)
      return {
        status: false,
        error: {
          target: "general",
          message:
            "You can not update this sale, try deleting and adding a new one!",
        },
      };
    try {
      getConnection().transaction(async () => {
        const client = await User.findOne(sale.clientId);
        if (!client) throw new Error("Client does not exist!");
        let oldCred: number;
        if (args.payed > 0) {
          const acc = await Account.findOne(args.accountId);
          if (!acc) throw new Error("Account does not exist!");
          acc.balance = acc.balance - sale.payed + args.payed;
          await acc.save();
          if (
            args.payed !==
            args.sellingPrice * args.quantity +
              args.pieceSellingPrice * args.pieceQuantity
          ) {
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
              if (oldCred!!) {
                let diff = client.balance - cred;
                if (diff < 0) {
                  client.balance = -diff;
                  client.credit = true;
                } else {
                  client.balance = diff;
                }
              } else {
                oldCred =
                  sale.sellingPrice * sale.quantity +
                  sale.pieceSellingPrice * sale.pieceQuantity -
                  sale.payed;
                let dif = client.balance + oldCred - cred;
                if (dif < 0) {
                  client.balance = -dif;
                  client.credit = true;
                } else {
                  client.balance = dif;
                }
              }
            }
            await client.save();
          }
        } else {
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
            } else {
              client.balance = -(client.balance + cred - oldCred);
              client.credit = false;
            }
          }
          if (!client.credit) {
            let diff = client.balance - cred + oldCred;
            if (diff < 0) {
              client.balance = -diff;
              client.credit = true;
            } else {
              client.balance = diff;
            }
          }
          await client.save();
        }
        const prod = await Product.findOne(args.productId);
        if (!prod) throw new Error("Product does not exist!");
        if (args.pieceQuantity > prod.pieces)
          throw new Error(
            `${prod.pieces} ${prod.pieceUnit} means 1 ${prod.unit}`
          );
        prod.stock = prod.stock - args.quantity + sale.quantity;
        if (args.pieceQuantity > 0) {
          if (prod.pieceStock < args.pieceQuantity) {
            prod.stock = prod.stock - 1;
            prod.pieceStock = prod.pieceStock + prod.pieces;
          }
          prod.pieceStock =
            prod.pieceStock - args.pieceQuantity + sale.pieceQuantity;
        }
        await prod.save();
        await Sale.update({ id }, { ...args });
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
  async deleteSale(@Arg("id") id: number): Promise<BooleanResponse> {
    const sale = await Sale.findOne(id);
    let oldCred: number;
    if (!sale)
      return {
        status: false,
        error: { target: "general", message: "Sale does not exist!" },
      };

    const prod = await Product.findOne(sale.productId);
    if (!prod)
      return {
        status: false,
        error: {
          target: "general",
          message: "Product acquired in this Sale does not exist!",
        },
      };

    try {
      getConnection().transaction(async () => {
        if (sale.payed > 0) {
          const acc = await Account.findOne(sale.accountId);
          if (!acc) throw new Error("Account does not exist!");
          acc.balance = acc.balance - sale.payed;
          await acc.save();
        }
        prod.stock = prod.stock + sale.quantity;
        prod.pieceStock = prod.pieceStock + sale.pieceQuantity;
        await prod.save();
        if (
          sale.payed !==
          sale.sellingPrice * sale.quantity +
            sale.pieceSellingPrice * sale.pieceQuantity
        ) {
          const client = await User.findOne(sale.clientId);
          if (!client) throw new Error("Client does not exist!");
          oldCred =
            sale.sellingPrice * sale.quantity +
            sale.pieceSellingPrice * sale.pieceQuantity -
            sale.payed;
          if (client.balance > oldCred) {
            if (client.credit) {
              client.balance = client.balance - oldCred;
            } else if (!client.credit) {
              client.balance = client.balance + oldCred;
            }
          } else if (client.balance < oldCred) {
            if (client.credit) {
              client.balance = -(client.balance - oldCred);
              client.credit = !client.credit;
            } else if (!client.credit) {
              client.balance = client.balance + oldCred;
            }
          }
          await client.save();
        }
        await Sale.delete(id);
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(Incentive)
          .where('"saleId" = :id', { id: id })
          .execute();
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

  @Query(() => [Sale])
  async getSales(): Promise<Sale[]> {
    let reqRes: Sale[] = await Sale.find({
      relations: ["client", "product", "seller", "account"],
      order: { saleDate: "DESC" },
    });
    return reqRes;
  }

  @Query(() => Sale, { nullable: true })
  getSale(@Arg("id") id: number): Promise<Sale | undefined> {
    return Sale.findOne(id, {
      relations: ["client", "product", "seller", "account", "creator"],
    });
  }
}
