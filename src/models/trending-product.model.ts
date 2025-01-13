import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";

import { Product, Platform } from "./";

@Entity()
export class TrendingProduct {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product, (product) => product.id, { onDelete: "CASCADE" })
  product!: Product;

  @ManyToOne(() => Platform)
  platform!: Platform;

  @Column({ type: "int", default: 0 })
  likes!: number;

  @Column({ type: "int", default: 0 })
  shares!: number;

  @Column({ type: "int", default: 0 })
  views!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  revenue!: number;

  @Column({ type: "int", default: 0 })
  unitsSold!: number;

  @Column({ nullable: true })
  trendScore!: number;

  @Column()
  isTrending!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
