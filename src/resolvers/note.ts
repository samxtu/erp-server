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
import { Note } from "../entities/Note";
import { BooleanResponse } from "./branch";

@InputType()
class NoteInput {
  @Field()
  title: string;
  @Field()
  details: string;
}

@Resolver(Note)
export class NoteResolver {
  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuth)
  async addNote(
    @Arg("args", () => NoteInput) args: NoteInput,
    @Ctx() { req }: MyContext
  ): Promise<BooleanResponse> {
    try {
      await Note.create({ ...args, creatorId: req.session.userId }).save();
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
  async editNote(
    @Arg("id") id: number,
    @Arg("args", () => NoteInput) args: NoteInput
  ): Promise<BooleanResponse> {
    const note = await Note.findOne(id);
    if (!note)
      return {
        status: false,
        error: { target: "general", message: "Note does not exist!" },
      };
    try {
      await Note.update({ id }, { ...args });
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
  async deleteNote(@Arg("id") id: number): Promise<BooleanResponse> {
    try {
      await Note.delete(id);
    } catch (err) {
      console.error(err.message);
      return {
        status: false,
        error: { target: "general", message: err.message },
      };
    }
    return { status: true };
  }

  @Query(() => [Note])
  async getNotes(@Arg("user") user: number): Promise<Note[]> {
    let reqRes: Note[] = await Note.find({
      where: { creatorId: user },
      order: { createdAt: "ASC" },
    });
    return reqRes;
  }

  @Query(() => Note, { nullable: true })
  getNote(@Arg("id") id: number): Promise<Note | undefined> {
    return Note.findOne(id);
  }
}
