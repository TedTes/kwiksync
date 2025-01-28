import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { MerchantSubscription } from "./";
@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "bigint" })
  monthlyPriceInCents: number;

  @Column({ type: "bigint" })
  annualPriceInCents: number;

  @Column({ type: "jsonb", nullable: true })
  features: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "text", nullable: true })
  description: string;

  // @OneToMany(() => MerchantSubscription, (subscription) => subscription.plan)
  // subscriptions: MerchantSubscription[];

  @Column({ default: false })
  isMostPopular: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
