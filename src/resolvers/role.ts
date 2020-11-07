import { isAuth } from "../middleware/isAuth";
import { Arg, Mutation, Resolver, UseMiddleware, Query } from "type-graphql";
import { Role } from "../entities/Role";
import { BooleanResponse } from "./branch";

@Resolver(Role)
export class RoleResolver {
  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async addRole(
    @Arg("name", () => String) name: string
  ): Promise<BooleanResponse> {
    try {
      await Role.create({ name }).save();
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
  async editRole(
    @Arg("id") id: number,
    @Arg("name", () => String) name: string
  ): Promise<BooleanResponse> {
    if (!name || name === "")
      return {
        status: false,
        error: { target: "general", message: "name can not be empty!" },
      };
    const role = await Role.findOne(id);
    if (!role)
      return {
        status: false,
        error: { target: "general", message: "role does not exist!" },
      };
    try {
      await Role.update({ id }, { name });
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
  async deleteRole(@Arg("id") id: number): Promise<BooleanResponse> {
    try {
      await Role.delete(id);
    } catch (err) {
      console.error(err.message);
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Query(() => [Role])
  getRoles(): Promise<Role[]> {
    return Role.find({ relations: ["users"] });
  }
}
