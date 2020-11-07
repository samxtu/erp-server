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
import { Asset } from "../entities/Asset";
import { BooleanResponse } from "./branch";

@InputType()
class AssetInput {
  @Field()
  name: string;
  @Field()
  code: string;
  @Field()
  condition: string;
  @Field()
  details: string;
  @Field()
  branchId: number;
}

@Resolver(Asset)
export class AssetResolver {
  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async addAsset(
    @Arg("args") args: AssetInput,
    @Ctx() { req }: MyContext
  ): Promise<BooleanResponse> {
    try {
      await Asset.create({ ...args, creatorId: req.session.userId }).save();
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
  async editAsset(
    @Arg("id") id: number,
    @Arg("args") args: AssetInput
  ): Promise<BooleanResponse> {
    if (!args.name || args.name === "")
      return {
        status: false,
        error: { target: "name", message: "Name can not be empty!" },
      };
    if (!args.branchId)
      return {
        status: false,
        error: { target: "branch", message: "A branch must be selected!" },
      };
    const asset = await Asset.findOne(id);
    if (!asset)
      return {
        status: false,
        error: { target: "general", message: "Asset does not exist!" },
      };
    try {
      await Asset.update({ id }, { ...args });
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
  async changeCondition(
    @Arg("id") id: number,
    @Arg("condition", () => String) condition: "working" | "not working"
  ): Promise<BooleanResponse> {
    const asset = await Asset.findOne(id);
    if (!asset)
      return {
        status: false,
        error: { target: "general", message: "Asset does not exist!" },
      };
    try {
      asset.condition = condition;
      await asset.save();
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
  async deleteAsset(@Arg("id") id: number): Promise<BooleanResponse> {
    try {
      await Asset.delete(id);
    } catch (err) {
      console.error(err.message);
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Query(() => [Asset])
  async getAssets(@Arg("branch") branch: number): Promise<Asset[]> {
    let reqRes: Asset[];
    if (branch) reqRes = await Asset.find({ where: { branchId: branch } });
    else reqRes = await Asset.find();
    return reqRes;
  }

  @Query(() => Asset, { nullable: true })
  getAsset(@Arg("id") id: number): Promise<Asset | undefined> {
    return Asset.findOne(id, {
      relations: ["receivedExpenses", "creator"],
    });
  }
}
