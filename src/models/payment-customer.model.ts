import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import { Merchant } from "./";

@Entity("payment_customers")
@Unique(["merchantId", "provider"])
export class PaymentCustomer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  provider: string;

  @ManyToOne(() => Merchant, (merchant) => merchant.paymentCustomers)
  merchant: Merchant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
