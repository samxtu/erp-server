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
import { Attendance } from "../entities/Attendance";
import { BooleanResponse } from "./branch";
import { Between, getConnection } from "typeorm";

@InputType()
class AttendanceInput {
  @Field()
  arrivedAt: string;
  @Field()
  attended: boolean;
  @Field()
  attendeeId: number;
  @Field()
  comment: string;
}

@InputType()
class AttendanceInputEdit {
  @Field()
  arrivedAt: string;
  @Field()
  attended: boolean;
  @Field()
  comment: string;
}

@Resolver(Attendance)
export class AttendanceResolver {
  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async addAttendance(
    @Arg("attendees", () => [AttendanceInput]) attendees: AttendanceInput[],
    @Ctx() { req }: MyContext
  ): Promise<BooleanResponse> {
    try {
      getConnection().transaction(async () => {
        attendees.forEach(async (attendee) => {
          await Attendance.create({
            ...attendee,
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
  async editAttendance(
    @Arg("id") id: number,
    @Arg("args", () => AttendanceInputEdit) args: AttendanceInputEdit
  ): Promise<BooleanResponse> {
    if (!args.arrivedAt)
      return {
        status: false,
        error: { target: "general", message: "arrival time can not be empty!" },
      };
    const attendance = await Attendance.findOne(id);
    if (!attendance)
      return {
        status: false,
        error: { target: "general", message: "Attendance does not exist!" },
      };
    try {
      await Attendance.update({ id }, { ...args });
    } catch (err) {
      console.error(err.message);
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Query(() => [Attendance])
  async getAttendances(
    @Arg("branch") branch: number,
    @Arg("start") start: Date,
    @Arg("end") end: Date
  ): Promise<Attendance[]> {
    let reqRes: Attendance[];
    // reqRes = await Attendance.find(
    //   branch
    //     ? {
    //         where: { arrivedAt: Between(start, end) },
    //         order: { arrivedAt: "ASC" },
    //         relations: ["attendee"],
    //       }
    //     : {}
    // );
    if (branch)
      reqRes = await Attendance.find({
        where: { arrivedAt: Between(start, end) },
        order: { arrivedAt: "ASC" },
        relations: ["attendee"],
      });
    else reqRes = await Attendance.find();
    return reqRes;
  }

  @Query(() => [Attendance])
  async getAttendance(
    @Arg("id") id: number,
    @Arg("start") start: Date,
    @Arg("end") end: Date
  ): Promise<Attendance[]> {
    const att = await Attendance.find({
      where: {
        attendeeId: id,
        arrivedAt: Between(start, end),
      },
      relations: ["attendee", "creator"],
      order: {
        arrivedAt: "ASC",
      },
    });
    return att;
  }
}
