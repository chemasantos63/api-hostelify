import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity(`invoices_report_detail_payments`)
export class InvoicePaymentDetail extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `varchar`, nullable: false })
  paymentDescription: string;

  @Column({ type: `varchar`, nullable: false })
  paymentAmount: string;

  @ManyToMany(() => Invoice, (invoice) => invoice.payments)
  @JoinColumn({ name: `invoiceId` })
  invoice: Invoice;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;

  constructor(partial?: Partial<InvoicePaymentDetail>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
