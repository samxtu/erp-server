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
import { Account } from "./Account";
import { User } from "./User";

@ObjectType()
@Entity()
export class Payment extends BaseEntity {
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
  paymentDate: Date;

  @Field()
  @Column({ type: "int" })
  payerId: number;

  @Field()
  @Column({ type: "int" })
  collectorId: number;

  @Field()
  @Column({ type: "text" })
  details: string;

  @Field()
  @Column({ type: "bigint" })
  ammount: number;

  @Field()
  @Column({ type: "int" })
  creatorId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.createdPayments)
  creator: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.payments)
  payer: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.collections)
  collector: User;

  @Field()
  @Column({ type: "int" })
  accountId: number;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.payments)
  account: Account;
}
