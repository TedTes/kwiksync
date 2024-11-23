import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Supplier } from "./supplier.model";
import { Product } from "./product.model";

@Entity()
export class SupplierProduct {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.id, { onDelete: "CASCADE" })
  supplier!: Supplier;

  @ManyToOne(() => Product, (product) => product.id, { onDelete: "CASCADE" })
  product!: Product;
}
