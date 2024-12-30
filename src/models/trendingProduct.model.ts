import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";

import { Product } from "./product.model";

@Entity()
export class TrendingProduct {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product, (product) => product.id, { onDelete: "CASCADE" })
  product!: Product;

  @Column({ default: 0 })
  likes!: number;

  @Column({ default: 0 })
  shares!: number;

  @Column({ default: 0 })
  views!: number;

  @Column({ nullable: true })
  trendScore!: number;

  @Column()
  isTrending!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
