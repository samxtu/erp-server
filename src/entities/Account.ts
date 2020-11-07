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
import { Payment } from "./Payment";
import { Purchase } from "./Purchase";
import { Sale } from "./Sale";
import { User } from "./User";

@ObjectType()
@Entity()
export class Account extends BaseEntity {
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
  number: string;

  @Field()
  @Column({ type: "bigint", default: 0 })
  balance!: number;

  @Field()
  @Column({ type: "int" })
  branchId!: number;

  @Field(() => Branch)
  @ManyToOne(() => Branch, (branch) => branch.accounts)
  branch!: Branch;

  @Field()
  @Column({ type: "int" })
  creatorId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.createdAccounts)
  creator: User;

  @Field(() => [Payment])
  @OneToMany(() => Payment, (payment) => payment.account)
  payments: Payment[];

  @Field(() => [Sale])
  @OneToMany(() => Sale, (sale) => sale.account)
  sales: Sale[];

  @Field(() => [Purchase])
  @OneToMany(() => Purchase, (purchase) => purchase.account)
  purchases: Purchase[];

  @Field(() => [Expense])
  @OneToMany(() => Expense, (exp) => exp.account)
  expenses: Expense[];
}
