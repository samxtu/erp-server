import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Account } from "./Account";
import { Incentive } from "./Incentive";
import { Product } from "./Product";
import { User } from "./User";

@ObjectType()
@Entity()
export class Sale extends BaseEntity {
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
  saleDate: Date;

  @Field()
  @Column({ type: "int" })
  clientId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.servedSales)
  client: User;

  @Field()
  @Column({ type: "int" })
  productId: number;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.sold)
  product: Product;

  @Field()
  @Column({ type: "int", default: 0 })
  quantity: number;

  @Field()
  @Column({ type: "int", default: 0 })
  pieceQuantity: number;

  @Field()
  @Column({ type: "bigint", default: 0 })
  sellingPrice: number;

  @Field()
  @Column({ type: "bigint", default: 0 })
  pieceSellingPrice: number;

  @Field()
  @Column({ type: "int" })
  creatorId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.createdSales)
  creator: User;

  @Field()
  @Column({ type: "int" })
  sellerId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.initiatedSales)
  seller: User;

  @Field()
  @Column({ type: "int" })
  accountId: number;

  @Field(() => Account)
  @ManyToOne(() => Account, (acc) => acc.sales)
  account: Account;

  @Field()
  @Column({ type: "bigint" })
  payed: number;

  @Field(() => Incentive)
  @OneToOne(() => Incentive, (inc) => inc.sale)
  incentive: Incentive;
}
