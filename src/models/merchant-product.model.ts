import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Merchant, Product } from ".";
@Entity()
export class MerchantProduct {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Merchant)
  merchant!: Merchant;

  @ManyToOne(() => Product)
  product!: Product;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  sellingPrice!: number;

  @Column({ default: 0 })
  stockQuantity!: number;

  @CreateDateColumn()
  listedDate!: Date;

  @Column({ nullable: true })
  unlistedDate?: Date;

  @Column({ default: true })
  isActive!: boolean;
}
