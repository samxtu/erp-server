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
  Int,
  Float,
} from "type-graphql";
import { IncentiveSheet } from "../entities/IncentiveSheet";
import { Between, getConnection } from "typeorm";
import { User } from "../entities/User";
import { Incentive } from "../entities/Incentive";
import { BooleanResponse } from "./branch";

@InputType()
class IncentiveInput {
  @Field()
  productId: number;
  @Field(() => Float)
  incentivePrice: number;
}

@InputType()
class SheetInput {
  @Field()
  name: string;
  @Field()
  state: "active" | "not" | "period" | "default";
  @Field()
  startDate: Date;
  @Field()
  endDate: Date;
  @Field(() => [Int])
  staff: number[];
  @Field(() => [IncentiveInput])
  productsIncentives: IncentiveInput[];
}

@Resolver(IncentiveSheet)
export class IncentiveResolver {
  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async addSheet(
    @Arg("args") args: SheetInput,
    @Ctx() { req }: MyContext
  ): Promise<BooleanResponse> {
    const { name, startDate, endDate, state, staff, productsIncentives } = args;
    const sheetNo = new Date().getTime();
    //Peleka front end hii njinga
    // let state: "active" | "not" | "period" | "default";
    // if (staff.length > 0) {
    //   if (startDate && endDate) {
    //     state = "period";
    //   } else if (def) {
    //     state = "default";
    //   } else {
    //     state = "active";
    //   }
    // } else {
    //   state = "not";
    // }
    try {
      getConnection().transaction(async () => {
        const users = await User.findByIds(staff);
        users.forEach(async (u) => {
          u.sheetId = sheetNo;
          u.incentive = true;
          await u.save();
        });
        productsIncentives.forEach(async (pi) => {
          await IncentiveSheet.create({
            ...pi,
            startDate,
            endDate,
            name,
            sheetNo,
            state,
            creatorId: req.session.userId,
          }).save();
        });
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
  async editSheet(
    @Arg("sheetNo") sheetNo: number,
    @Arg("args") args: SheetInput
  ): Promise<BooleanResponse> {
    const { name, startDate, state, endDate, staff, productsIncentives } = args;
    try {
      getConnection().transaction(async () => {
        const users = await User.findByIds(staff);
        users.forEach(async (u) => {
          u.sheetId = sheetNo;
          u.incentive = true;
          await u.save();
        });
        productsIncentives.forEach(async (pi) => {
          const IS = await IncentiveSheet.findOne({
            where: { productId: pi.productId, sheetNo: sheetNo },
          });
          if (!IS) return;
          IS.name = name;
          IS.startDate = startDate;
          IS.endDate = endDate;
          IS.state = state;
          IS.incentivePrice = pi.incentivePrice;
          await IS.save();
        });
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
  async deleteSheet(@Arg("sheetNo") sheetNo: number): Promise<BooleanResponse> {
    try {
      getConnection().transaction(async () => {
        const users = await User.find({ where: { sheetId: sheetNo } });
        if (users.length > 0) throw new Error("Sheet actively used by staff!");
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(IncentiveSheet)
          .where('"sheetNo" = :id', { id: sheetNo })
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

  @Query(() => [Incentive])
  async getIncentives(
    @Arg("start") start: Date,
    @Arg("end") end: Date,
    @Arg("staff") staff: number
  ): Promise<Incentive[]> {
    let reqRes: Incentive[];
    if (staff)
      reqRes = await Incentive.find({
        where: {
          staffId: staff,
          createdAt: Between(start, end),
        },
        relations: ["staff", "product", "sale"],
      });
    else
      reqRes = await Incentive.find({
        where: {
          createdAt: Between(start, end),
        },
        order: { staffId: "ASC" },
        relations: ["staff", "product", "sale"],
      });
    return reqRes;
  }

  @Query(() => [IncentiveSheet])
  getIncentiveSheets(): Promise<IncentiveSheet[]> {
    return IncentiveSheet.find();
  }

  @Query(() => IncentiveSheet, { nullable: true })
  getIncentiveSheet(
    @Arg("id") id: number
  ): Promise<IncentiveSheet | undefined> {
    return IncentiveSheet.findOne({
      where: { sheetNo: id },
      relations: ["users", "product"],
    });
  }
}
