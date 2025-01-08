import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Product } from ".";
@Entity()
export class ProductInventory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product)
  product!: Product;

  @Column({ default: 0 })
  quantity!: number;

  @Column({ default: 10 })
  restockThreshold!: number;

  @Column({ nullable: true })
  restockAmount!: number;

  @Column({ nullable: true })
  location?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
