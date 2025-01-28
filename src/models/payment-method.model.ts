import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { PaymentCustomer } from "./";

@Entity("payment_methods")
export class PaymentMethod {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  methodType:
    | "credit_card"
    | "debit_card"
    | "paypal"
    | "bank_account"
    | "wallet";

  @Column()
  provider: string;

  @Column()
  lastFourDigits: string; // For card payments

  @Column({ nullable: true })
  expiryDate: Date; // For card payments

  @ManyToOne(
    () => PaymentCustomer,
    (paymentCustomer) => paymentCustomer.paymentMethods
  )
  paymentCustomer: PaymentCustomer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
