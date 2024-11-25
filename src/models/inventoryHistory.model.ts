import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Product } from "./product.model";

@Entity()
export class InventoryHistory {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne(() => Product, (product) => product.id, { onDelete: "CASCADE" })
  product!: Product;

  @Column()
  quantity!: number;

  @CreateDateColumn()
  timestamp!: Date;
}
