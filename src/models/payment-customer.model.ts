import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Merchant } from "./";

@Entity("payment_customers")
export class PaymentCustomer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  provider: string;

  @ManyToOne(() => Merchant, (merchant) => merchant.paymentCustomers)
  merchant: Merchant;

  // @OneToMany(
  //   () => PaymentMethod,
  //   (paymentMethod) => paymentMethod.paymentCustomer
  // )
  // paymentMethods: PaymentMethod[];

  @Column({ type: "jsonb", nullable: true })
  customerMetadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
