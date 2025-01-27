import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("decimal")
  monthlyPrice: number;

  @Column("decimal")
  annualPrice: number;

  @Column("simple-array")
  features: string[];

  @Column()
  isActive: boolean;
}
