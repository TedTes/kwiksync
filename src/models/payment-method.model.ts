import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
