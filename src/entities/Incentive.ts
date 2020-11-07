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
import { Product } from "./Product";
import { Sale } from "./Sale";
import { User } from "./User";

@ObjectType()
@Entity()
export class Incentive extends BaseEntity {
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
  staffId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.incentives)
  staff: User;

  @Field()
  @Column({ type: "int" })
  productId: number;

  @Field(() => Product)
  @ManyToOne(() => Product, (prod) => prod.incentives)
  product: Product;

  @Field()
  @Column({ type: "int" })
  saleId: number;

  @Field()
  @Column({ type: "int" })
  quantity: number;

  @Field()
  @Column({ type: "bigint" })
  incentivePrice: number;

  @Field(() => Sale)
  @OneToOne(() => Sale, (sale) => sale.incentive)
  sale: Sale;
}
