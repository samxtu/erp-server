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
import { Asset } from "./Asset";
import { User } from "./User";

@ObjectType()
@Entity()
export class Expense extends BaseEntity {
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
  expenseDate: Date;

  @Field()
  @Column({ type: "int" })
  authorizerId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.authorizedExpenses)
  authorizer: User;

  @Field()
  @Column({ type: "int" })
  staffId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.receivedExpenses)
  staff: User;

  @Field()
  @Column({ type: "int" })
  assetId: number;

  @Field(() => Asset)
  @ManyToOne(() => Asset, (asset) => asset.receivedExpenses)
  asset: Asset;

  @Field(() => String)
  @Column({ type: "text" })
  type!: "staff" | "normal" | "asset";

  @Field()
  @Column({ type: "text" })
  title: string;

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
  @ManyToOne(() => User, (user) => user.createdExpenses)
  creator: User;

  @Field()
  @Column({ type: "int" })
  accountId: number;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.expenses)
  account: Account;
}
