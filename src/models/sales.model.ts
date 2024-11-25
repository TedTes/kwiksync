import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Product } from "./product.model";

@Entity()
export class Sales {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne(() => Product, (product) => product.id, { onDelete: "CASCADE" })
  product!: Product;

  @Column()
  productId!: string;

  @Column()
  quantitySold!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  totalRevenue!: number;

  @CreateDateColumn()
  saleDate!: Date;
}
