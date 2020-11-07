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
  unit!: string;

  @Field()
  @Column()
  pieceUnit: string;

  @Field()
  @Column({ type: "int" })
  pieces!: number;

  @Field(() => [Purchase])
  @OneToMany(() => Purchase, (purchase) => purchase.product)
  purchases: Purchase[];

  @Field(() => [IncentiveSheet])
  @OneToMany(() => IncentiveSheet, (IS) => IS.product)
  incentiveSheets: IncentiveSheet[];

  @Field(() => [Incentive])
  @OneToMany(() => Incentive, (IS) => IS.product)
  incentives: Incentive[];

  @Field(() => [Sale])
  @OneToMany(() => Sale, (sale) => sale.product)
  sold: Sale[];

  @Field()
  @Column({ type: "int", default: 0 })
  stock: number;

  @Field()
  @Column({ type: "int", default: 0 })
  pieceStock: number;

  @Field()
  @Column({ type: "bigint", default: 0 })
  sellingPrice: number;

  @Field()
  @Column({ type: "int", default: 0 })
  pieceSellingPrice: number;
}
