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
} from "type-graphql";
import { Product } from "../entities/Product";
import { BooleanResponse } from "./branch";

@InputType()
class ProductInput {
  @Field()
  name: string;
  @Field()
  unit: string;
  @Field()
  pieces: number;
  @Field()
  pieceUnit: string;
}

@Resolver(Product)
export class ProductResolver {
  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async addProduct(
    @Arg("args") args: ProductInput,
    @Ctx() { req }: MyContext
  ): Promise<BooleanResponse> {
    try {
      await Product.create({ ...args, creatorId: req.session.userId }).save();
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
  async editProduct(
    @Arg("id") id: number,
    @Arg("args") args: ProductInput
  ): Promise<BooleanResponse> {
    const product = await Product.findOne(id);
    if (!product)
      return {
        status: false,
        error: { target: "general", message: "Product does not exist!" },
      };
    try {
      await Product.update({ id }, { ...args });
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
  async deleteProduct(@Arg("id") id: number): Promise<BooleanResponse> {
    try {
      await Product.delete(id);
    } catch (err) {
      console.error(err.message);
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Query(() => [Product])
  async getProducts(): Promise<Product[]> {
    let reqRes: Product[] = await Product.find({
      order: { name: "ASC" },
    });
    return reqRes;
  }

  @Query(() => Product, { nullable: true })
  getProduct(@Arg("id") id: number): Promise<Product | undefined> {
    return Product.findOne(id, {
      relations: [
        "purchases",
        "sold",
        "incentiveSheets",
        "incentives",
        "creator",
      ],
    });
  }
}
