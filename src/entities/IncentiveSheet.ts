import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "./Product";
import { User } from "./User";

@ObjectType()
@Entity()
export class IncentiveSheet extends BaseEntity {
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
  @ManyToOne(() => User, (user) => user.createdIncentiveSheets)
  creator: User;

  @Field(() => String)
  @Column({ type: "timestamp" })
  startDate: Date;

  @Field(() => String)
  @Column({ type: "timestamp" })
  endDate: Date;

  @Field()
  @Column({ type: "text" })
  name: string;

  @Field()
  @Column({ type: "text" })
  state: "active" | "not" | "period" | "default";

  @Field()
  @Column({ type: "bigint" })
  sheetNo: number;

  @Field()
  @Column()
  productId: number;

  @Field(() => Product)
  @ManyToOne(() => Product, (prod) => prod.incentiveSheets)
  product: Product;

  @Field()
  @Column({ type: "bigint" })
  incentivePrice: number;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.sheet)
  users: User[];
}
