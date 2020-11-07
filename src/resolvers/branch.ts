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
  ObjectType,
  Query,
} from "type-graphql";
import { Branch } from "../entities/Branch";
import { FieldError } from "./User";

@InputType()
class BranchInput {
  @Field()
  name: string;
  @Field()
  phone: string;
  @Field()
  regionId: number;
  @Field()
  street: string;
}

@ObjectType()
export class BooleanResponse {
  @Field()
  status: boolean;
  @Field(() => FieldError, { nullable: true })
  error?: FieldError;
}

@Resolver(Branch)
export class BranchResolver {
  @Mutation(() => BooleanResponse)
  async addBranch(
    @Arg("args") args: BranchInput,
    @Ctx() { req }: MyContext
  ): Promise<BooleanResponse> {
    try {
      await Branch.create({ ...args}).save();
    } catch (err) {
      console.log(err.message);
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async editBranch(
    @Arg("id") id: number,
    @Arg("args") args: BranchInput
  ): Promise<BooleanResponse> {
    if (!name || name === "")
      return {
        status: false,
        error: { target: "name", message: "Name can not be empty!" },
      };
    const branch = await Branch.findOne(id);
    if (!branch)
      return {
        status: false,
        error: { target: "general", message: "branch does not exist!" },
      };
    try {
      await Branch.update({ id }, { ...args });
    } catch (err) {
      console.log(err.message);
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async deleteBranch(@Arg("id") id: number): Promise<BooleanResponse> {
    try {
      await Branch.delete(id);
    } catch (err) {
      console.log(err.message);
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Query(() => [Branch])
  async getBranches(): Promise<Branch[]> {
    let reqRes: Branch[] = await Branch.find({relations:["region"]});
    return reqRes;
  }

  @Query(() => Branch, { nullable: true })
  getBranch(@Arg("id") id: number): Promise<Branch | undefined> {
    return Branch.findOne(id, {
      relations: ["users", "assets", "accounts", "creator"],
    });
  }
}
