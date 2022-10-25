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
import { Incentive } from "./Incentive";
import { IncentiveSheet } from "./IncentiveSheet";
import { Purchase } from "./Purchase";
import { Sale } from "./Sale";
import { User } from "./User";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
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
  @Column({ type: "int" })
  creatorId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.createdProducts)
  creator: User;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  unit!: string; //This is the unit for buying and selling the product example soda can be bought in crates so crate is the unit

  @Field()
  @Column()
  pieceUnit: string; //This is the unit of pieces of our product example soda can be bought in crates but can be sold in bottles so a bottle is the subunit for our product

  @Field()
  @Column({ type: "int" })
  pieces!: number; //How many subunits in one unit? for a crate there are 24 soda bottles so 24 are our pieces

  @Field(() => [Purchase])
  @OneToMany(() => Purchase, (purchase) => purchase.product)
  purchases: Purchase[]; // this is what adds products to our inventory

  @Field(() => [IncentiveSheet])
  @OneToMany(() => IncentiveSheet, (IS) => IS.product)
  incentiveSheets: IncentiveSheet[]; //if we give incentives to our employees this is where we set how much they get from selling the product

  @Field(() => [Incentive])
  @OneToMany(() => Incentive, (IS) => IS.product)
  incentives: Incentive[];

  @Field(() => [Sale])
  @OneToMany(() => Sale, (sale) => sale.product)
  sold: Sale[]; //here we store how many units of product has been sold

  @Field()
  @Column({ type: "int", default: 0 })
  stock: number; //our inventory decrease by sales and increase by purchases

  @Field()
  @Column({ type: "int", default: 0 })
  pieceStock: number; //incase a unit was sold by pieces, how many remains

  @Field()
  @Column({ type: "bigint", default: 0 })
  sellingPrice: number;

  @Field()
  @Column({ type: "int", default: 0 })
  pieceSellingPrice: number;
}
