import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: "merchant" })
  role!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "text", nullable: true })
  refreshToken!: string | null;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column()
  lastLoginAt!: Date;
}
