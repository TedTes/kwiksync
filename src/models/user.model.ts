import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: "merchant" })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "text", nullable: true })
  refreshToken: string | null;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  picture: string;

  @Column({ nullable: true })
  googleId: string;
}
