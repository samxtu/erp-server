import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import {
  Arg,
  Mutation,
  Resolver,
  Ctx,
  UseMiddleware,
  Query,
} from "type-graphql";
import { Region } from "../entities/Region";
import { BooleanResponse } from "./branch";

@Resolver(Region)
export class RegionsResolver {
  @Mutation(() => BooleanResponse)
  async addRegion(
    @Arg("name", () => String) name: string,
    @Ctx() { req }: MyContext
  ): Promise<BooleanResponse> {
    try {
      await Region.create({ name }).save();
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
  async editRegion(
    @Arg("id") id: number,
    @Arg("name", () => String) name: string
  ): Promise<BooleanResponse> {
    if (!name || name === "")
      return {
        status: false,
        error: { target: "general", message: "name can not be empty!" },
      };
    const region = await Region.findOne(id);
    if (!region)
      return {
        status: false,
        error: { target: "general", message: "region does not exist!" },
      };

    try {
      await Region.update({ id }, { name });
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
  async deleteRegion(@Arg("id") id: number): Promise<BooleanResponse> {
    try {
      await Region.delete(id);
    } catch (err) {
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Query(() => [Region])
  getRegions(): Promise<Region[]> {
    return Region.find({ relations: ["branches"] });
  }
}
