import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity(`invoices_report_detail`)
export class InvoiceDetail extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  quantity: string;

  description: string;

  roomersQuantity: string;

  unitPrice: string;

  discount: string;

  total: string;

  @ManyToMany(() => Invoice, (invoice) => invoice.detail)
  invoice: Invoice;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;

  constructor(partial?: Partial<InvoiceDetail>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
