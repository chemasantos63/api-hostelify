import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permanence } from './permanence.entity';

@Entity(`guest`)
export class Guest extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `varchar`, unique: false, length: 60, nullable: false })
  name: string;

  @Column({ type: `varchar`, unique: false, length: 60, nullable: false })
  lastname: string;

  @Column({ type: `varchar`, unique: false, length: 20, nullable: false })
  nationality: string;

  @Column({ type: `varchar`, unique: false, length: 20, nullable: false })
  origin: string;

  @Column({ type: `varchar`, unique: false, length: 20, nullable: false })
  destination: string;

  @Column({ type: `varchar`, unique: false, length: 20, nullable: true })
  occupation: string;

  @Column({ type: `varchar`, unique: false, length: 20, nullable: false })
  phone: string;

  permanences: Permanence[];

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;
}
