import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Merchant, Plan, PaymentMethod } from "./";
@Entity()
export class MerchantSubscription {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  provider: string;

  @ManyToOne(() => Merchant, { eager: true, onDelete: "CASCADE" })
  merchant: Merchant;

  @ManyToOne(() => Plan, { eager: true })
  plan: Plan;

  @Column({ type: "enum", enum: ["monthly", "annual"], default: "monthly" })
  billingCycle: "monthly" | "annual";

  @Column({
    type: "enum",
    enum: ["active", "inactive", "canceled", "pending"],
    default: "active",
  })
  status: "active" | "inactive" | "canceled" | "pending";

  @ManyToOne(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Column({ type: "timestamp" })
  currentPeriodStart: Date;

  @Column({ type: "timestamp", nullable: true })
  currentPeriodEnd: Date;

  @Column({ default: false })
  cancelAtPeriodEnd: boolean;

  @Column({ type: "timestamp", nullable: true })
  canceledAt: Date;

  @Column({ type: "jsonb", nullable: true })
  paymentMetadata: any;

  @Column({ nullable: true })
  paymentProviderSubscriptionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
