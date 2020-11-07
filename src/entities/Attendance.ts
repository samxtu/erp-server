import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Attendance extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt = new Date();

  @Field(() => String)
  @Column({ type: "timestamp" })
  arrivedAt: Date;

  @Field()
  @Column()
  attended: boolean;

  @Field()
  @Column({ type: "text" })
  comment: string;

  @Field()
  @Column({ type: "int" })
  attendeeId: number;

  @ManyToOne(() => User, (user) => user.attendances)
  attendee: User;

  @Field()
  @Column({ type: "int" })
  creatorId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.createdAttendances)
  creator: User;
}
