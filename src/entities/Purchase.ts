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
import { Product } from "./Product";
import { User } from "./User";

@ObjectType()
@Entity()
export class Purchase extends BaseEntity {
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
  purchaseDate: Date;

  @Field()
  @Column({ type: "int" })
  supplierId: number;

  @Field()
  @Column({ type: "int" })
  productId: number;
 
  @Field()
  @Column({ type: "int", default: 0 })
  quantity: number;

  @Field()
  @Column({ type: "bigint" })
  purchasePrice: number;

  @Field()
  @Column({ type: "bigint" })
  sellingPrice: number;

  @Field()
  @Column({ type: "bigint" })
  pieceSellingPrice: number;

  @Field()
  @Column({ nullable: true })
  receipt: string;

  @Field()
  @Column({ type: "int" })
  creatorId!: number;

  @Field()
  @Column({ type: "int" })
  accountId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.createdPurchases)
  creator: User;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.purchases)
  account: Account;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.suppliedPurchases)
  supplier: User;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.purchases)
  product: Product;
}
