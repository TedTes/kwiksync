import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { MerchantSubscription } from "./";
@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("decimal")
  monthlyPrice: number;

  @Column("decimal")
  annualPrice: number;

  @Column("simple-array")
  features: string[];

  @Column()
  isActive: boolean;

  @Column()
  description: string;

  @OneToMany(() => MerchantSubscription, (subscription) => subscription.plan)
  subscriptions: MerchantSubscription[];

  @Column({ default: false })
  isMostPopular: boolean;
}
