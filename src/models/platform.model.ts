import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
} from "typeorm";
import { Product } from "./product.model";
@Entity()
export class Platform {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => Product)
  products!: Product[];

  @CreateDateColumn()
  createdAt!: Date;
}
