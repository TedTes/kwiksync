import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";
import { Platform, Product } from ".";
@Entity()
export class ProductPlatform {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product)
  product!: Product;

  @ManyToOne(() => Platform)
  platform!: Platform;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  platformPrice!: number;

  @Column({ nullable: true })
  platformSku?: string;

  @Column({ default: true })
  isActive!: boolean;

  @UpdateDateColumn()
  updatedAt!: Date;

  @CreateDateColumn()
  listedAt!: Date;

  @Column({ nullable: true })
  unlistedAt?: Date;
}
