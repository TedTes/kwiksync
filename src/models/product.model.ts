import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Platform } from "./";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

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
