import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Merchant } from "./merchant.model";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne(() => Merchant, (merchant) => merchant.id, { onDelete: "CASCADE" })
  merchant!: Merchant;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: 0 })
  quantity!: number;

  @Column({ default: 10 })
  threshold!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
