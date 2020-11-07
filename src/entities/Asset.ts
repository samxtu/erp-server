import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Branch } from "./Branch";
import { Expense } from "./Expense";
import { User } from "./User";

@ObjectType()
@Entity()
export class Asset extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt = new Date();

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  code: string;

  @Field()
  @Column()
  condition: string;

  @Field()
  @Column()
  details: string;

  @Field()
  @Column({ type: "int" })
  branchId: number;

  @Field(() => Branch)
  @ManyToOne(() => Branch, (branch) => branch.assets)
  branch: Branch;

  @Field()
  @Column({ type: "int" })
  creatorId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.createdAssets)
  creator: User;

  @Field(() => [Expense])
  @OneToMany(() => Expense, (expense) => expense.asset)
  receivedExpenses: Expense[];
}
