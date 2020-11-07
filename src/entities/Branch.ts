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
import { Account } from "./Account";
import { Asset } from "./Asset";
import { Region } from "./Region";
import { User } from "./User";

@ObjectType()
@Entity()
export class Branch extends BaseEntity {
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
  phone!: string;

  @Field()
  @Column({ type: "int" })
  regionId!: number;

  @Field(() => Region)
  @ManyToOne(() => Region, (region) => region.branches)
  region: Region;

  @Field(() => [Account])
  @OneToMany(() => Account, (account) => account.branch)
  accounts: Account[];

  @Field()
  @Column()
  street!: string;

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.branch)
  users: User[];

  @Field(() => [Asset])
  @OneToMany(() => Asset, (asset) => asset.branch)
  assets: Asset[];
}
