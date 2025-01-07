import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Merchant, Supplier, Platform } from "./";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Merchant, (merchant) => merchant.id, { onDelete: "CASCADE" })
  merchant!: Merchant;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: 0 })
  quantity!: number;

  @Column({ default: 10 })
  restockThreshold!: number;

  @Column({ nullable: true })
  restockAmount!: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, {
    nullable: true,
    onDelete: "SET NULL",
  })
  supplier!: Supplier;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToMany(() => Platform)
  @JoinTable({
    name: "product_platforms", // Name of the join table
    joinColumn: {
      name: "productId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "platformId",
      referencedColumnName: "id",
    },
  })
  platforms!: Platform[];
}
