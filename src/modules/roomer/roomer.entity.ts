import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(`roomers`)
export class Roomer extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `varchar`, unique: false, length: 35, nullable: false })
  name: string;

  @Column({ type: `varchar`, unique: false, length: 35, nullable: false })
  lastname: string;

  @Column({ type: `varchar`, unique: true, length: 60, nullable: false })
  documentNumber: string;

  @Column({ type: `varchar`, unique: true, length: 30, nullable: false })
  nationality: string;

  @Column({ type: `varchar`, unique: true, length: 30, nullable: false })
  origin: string;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;
}
