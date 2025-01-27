import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Merchant, Plan } from "./";
@Entity()
export class MerchantSubscription {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Merchant)
  merchant: Merchant;

  @ManyToOne(() => Plan)
  plan: Plan;

  @Column()
  startDate: Date;

  @Column()
  billingCycle: "monthly" | "annual";
}
