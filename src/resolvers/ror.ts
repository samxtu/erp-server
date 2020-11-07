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
import { ROR } from "../entities/ROR";
import { BooleanResponse } from "./branch";

@InputType()
class RORInput {
  @Field()
  name: string;
  @Field()
  buying: number;
  @Field()
  selling: number;
}

@Resolver(ROR)
export class RORResolver {
  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async addROR(
    @Arg("args", () => RORInput) args: RORInput,
    @Ctx() { req }: MyContext
  ): Promise<BooleanResponse> {
    try {
      await ROR.create({ ...args, creatorId: req.session.userId }).save();
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
  async editROR(
    @Arg("id") id: number,
    @Arg("args", () => RORInput) args: RORInput
  ): Promise<BooleanResponse> {
    const _ROR = await ROR.findOne(id);
    if (!_ROR)
      return {
        status: false,
        error: { target: "general", message: "ROR does not exist!" },
      };
    try {
      await ROR.update({ id }, { ...args });
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
  async deleteROR(@Arg("id") id: number): Promise<BooleanResponse> {
    try {
      await ROR.delete(id);
    } catch (err) {
      console.error(err.message);
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Query(() => [ROR])
  getRORs(@Arg("id") id: number): Promise<ROR[]> {
    return ROR.find({ where: { creatorId: id } });
  }
}
