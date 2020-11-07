import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Account } from "./Account";
import { Asset } from "./Asset";
import { Attendance } from "./Attendance";
import { Branch } from "./Branch";
import { Expense } from "./Expense";
import { Incentive } from "./Incentive";
import { IncentiveSheet } from "./IncentiveSheet";
import { Note } from "./Note";
import { Payment } from "./Payment";
import { Product } from "./Product";
import { Purchase } from "./Purchase";
import { Region } from "./Region";
import { Role } from "./Role";
import { ROR } from "./ROR";
import { Sale } from "./Sale";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field()
  @Column({ type: "text", unique: true })
  name!: string;

  @Field()
  @Column({ type: "text", unique: true })
  email: string;

  @Field()
  @Column({ type: "text", unique: true })
  phone: string;

  @Field()
  @Column({ type: "text" })
  location: string;

  @Field()
  @Column({ type: "bigint" })
  maxCredit: number;

  @Field()
  @Column({ type: "int" })
  creditDays: number;

  @Field()
  @Column({ default: true })
  credit: boolean;

  @Field()
  @Column({ type: "bigint", default: 0 })
  balance: number;

  @Field()
  @Column({ type: "bigint", default: 0 })
  salary: number;

  @Field()
  @Column({ type: "int" })
  roleId: number;

  @Field(() => Role)
  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @Field()
  @Column({ type: "int" })
  branchId: number;

  @Field(() => Branch)
  @ManyToOne(() => Branch, (branch) => branch.users)
  branch: Branch;

  @Field(() => [Note])
  @OneToMany(() => Note, (note) => note.creator)
  notes: Note[];

  @Field(() => [Purchase])
  @OneToMany(() => Purchase, (purchase) => purchase.creator)
  createdPurchases: Purchase[];

  @Field(() => [Payment])
  @OneToMany(() => Payment, (payment) => payment.creator)
  createdPayments: Payment[];

  @Field(() => [Purchase])
  @OneToMany(() => Purchase, (purchase) => purchase.supplier)
  suppliedPurchases: Purchase[];

  @Field(() => [ROR])
  @OneToMany(() => ROR, (ROR) => ROR.creator)
  RORS: ROR[];

  @Field(() => [Attendance])
  @OneToMany(() => Attendance, (attendance) => attendance.creator)
  createdAttendances: Attendance[];

  @Field(() => [Attendance])
  @OneToMany(() => Attendance, (attendance) => attendance.attendee)
  attendances: Attendance[];

  @Field(() => [Payment])
  @OneToMany(() => Payment, (payment) => payment.payer)
  payments: Payment[];

  @Field(() => [Payment])
  @OneToMany(() => Payment, (payment) => payment.collector)
  collections: Payment[];

  @Field(() => [IncentiveSheet])
  @ManyToMany(() => IncentiveSheet, (IS) => IS.users)
  @JoinTable()
  sheet: IncentiveSheet[];

  @Field()
  @Column({ type: "int", nullable: true })
  sheetId: number;

  @Field()
  @Column({ default: false })
  incentive: boolean;

  @Field(() => [Incentive])
  @OneToMany(() => Incentive, (incentive) => incentive.staff)
  incentives: Incentive[];

  @Field(() => [Sale])
  @OneToMany(() => Sale, (sale) => sale.client)
  servedSales: Sale[];

  @Field(() => [Sale])
  @OneToMany(() => Sale, (sale) => sale.creator)
  createdSales: Sale[];

  @Field(() => [Expense])
  @OneToMany(() => Expense, (xpense) => xpense.creator)
  createdExpenses: Expense[];

  @Field(() => [Sale])
  @OneToMany(() => Sale, (sale) => sale.seller)
  initiatedSales: Sale[];

  @Field(() => [Expense])
  @OneToMany(() => Expense, (expense) => expense.authorizer)
  authorizedExpenses: Expense[];

  @Field(() => [Expense])
  @OneToMany(() => Expense, (expense) => expense.staff)
  receivedExpenses: Expense[];

  @Field(() => [Account])
  @OneToMany(() => Account, (Account) => Account.creator)
  createdAccounts: Account[];

  @Field(() => [Asset])
  @OneToMany(() => Asset, (Asset) => Asset.creator)
  createdAssets: Asset[];

  @Field(() => [IncentiveSheet])
  @OneToMany(() => IncentiveSheet, (IncentiveSheet) => IncentiveSheet.creator)
  createdIncentiveSheets: IncentiveSheet[];

  @Field(() => [Product])
  @OneToMany(() => Product, (Product) => Product.creator)
  createdProducts: Product[];

  @Column({ type: "text", default: "halisia" })
  password: string;
}
