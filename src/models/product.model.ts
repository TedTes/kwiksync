import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Merchant, Supplier } from "./";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  merchantId!: string;

  @ManyToOne(() => Merchant, (merchant) => merchant.id, { onDelete: "CASCADE" })
  merchant!: Merchant;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: 0 })
  quantity!: number;

  @Column({ default: 10 })
  restockThreshold!: number;

  @Column({ nullable: true })
  restockAmount!: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, {
    nullable: true,
    onDelete: "SET NULL",
  })
  supplier!: Supplier;

  @Column({ nullable: true })
  supplierId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
