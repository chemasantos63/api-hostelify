import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(`fiscal_informations`)
export class FiscalInformation extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `varchar`, nullable: false })
  prefix: string;

  @Column({ type: `integer`, nullable: false })
  begin: number;

  @Column({ type: `integer`, nullable: false })
  end: number;

  @Column({ type: `date`, nullable: false })
  dateValidFrom: Date;

  @Column({ type: `date`, nullable: false })
  dateValidTo: Date;

  @Column({ type: `varchar`, nullable: false })
  cai: string;

  @Column({ type: `integer`, nullable: false })
  currentNumber: number;

  @Column({ type: `integer`, nullable: false })
  range: number;

  @Column({ type: `varchar`, nullable: false, default: 'active' })
  status: string;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;

  constructor(partial: Partial<FiscalInformation>) {
    super();
    Object.assign(this, partial);
  }
}
