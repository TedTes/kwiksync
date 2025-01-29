import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { MerchantSubscription } from "./";
@Entity()
export class Merchant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @OneToMany(
    () => MerchantSubscription,
    (subscription) => subscription.merchant
  )
  subscriptions: MerchantSubscription[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
