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
  id!: number;

  @ManyToOne(() => Product, (product) => product.id, { onDelete: "CASCADE" })
  product!: Product;

  @Column()
  quantitySold!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  totalRevenue!: number;

  @CreateDateColumn()
  saleDate!: Date;
}
