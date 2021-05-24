import { FiscalInformation } from './../../fiscal-information/entities/fiscal-information.entity';
import { Total } from './../../total/entities/total.entity';
import { Payment } from './../../payment/entities/payment.entity';
import { Permanence } from './../../permanence/entities/permanence.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(`invoices`)
export class Billing extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @OneToMany(() => Permanence, (permanence) => permanence.invoice)
  permanences: Permanence[];

  @OneToMany(() => Payment, (payment) => payment.invoice, { eager: true })
  payments: Payment[];

  @OneToOne((type) => Total, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: `total_id` })
  total: Total;

  @ManyToOne((type) => FiscalInformation, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: `fiscalInformation_id` })
  fiscalInformation: FiscalInformation;

  @Column({ type: `varchar`, nullable: false })
  cai: string;

  @Column({ type: `integer`, nullable: false })
  invoiceNumber: number;

  @Column({ type: `varchar`, nullable: false, default: 'active' })
  status: string;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;

  constructor(partial?: Partial<Billing>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
