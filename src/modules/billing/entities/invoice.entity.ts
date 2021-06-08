import { Billing } from './billing.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceDetail } from './invoice-detail.entity';
import { InvoicePaymentDetail } from './invoice-payment-detail.entity';

@Entity(`invoices_report`)
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `varchar`, nullable: true })
  customerCode: string;

  @Column({ type: `varchar`, nullable: true })
  customerIdentification: string;

  @Column({ type: `varchar`, nullable: true })
  customerName: string;

  @Column({ type: `varchar`, nullable: true })
  invoiceCai: string;

  @Column({ type: `varchar`, nullable: true })
  invoiceCondition: string;

  @Column({ type: `varchar`, nullable: true })
  invoiceDateAndTime: string;

  @Column({ type: `varchar`, nullable: true })
  invoiceNumber: string;

  @Column({ type: `varchar`, nullable: true })
  invoiceSubtotal: string;

  @Column({ type: `varchar`, nullable: true })
  invoiceTaxableAmount15: string;

  @Column({ type: `varchar`, nullable: true })
  invoiceTaxAmount15: string;

  @Column({ type: `varchar`, nullable: true })
  invoiceTaxableAmount18: string;

  @Column({ type: `varchar`, nullable: true })
  invoiceTaxAmount18: string;

  @Column({ type: `varchar`, nullable: true })
  invoiceTaxAmount4: string;

  @Column({ type: `varchar`, nullable: true })
  invoiceExentAmount: string;

  @Column({ type: `varchar`, nullable: true })
  invoiceExoneratedAmount: string;

  @Column({ type: `varchar`, nullable: true })
  invoiceTotal: string;

  @Column({ type: `varchar`, nullable: true })
  fiscalInformationDateValidTo: string;

  @Column({ type: `varchar`, nullable: true })
  fiscalInformationRange: string;

  @Column({ type: `varchar`, nullable: true })
  totalWrittenValue: string;

  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.invoice, {
    eager: true,
  })
  detail: InvoiceDetail[];

  @OneToMany(
    () => InvoicePaymentDetail,
    (invoicePaymentDetail) => invoicePaymentDetail.invoice,
    { eager: true },
  )
  payments: InvoicePaymentDetail[];

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;

  constructor(partial?: Partial<Invoice>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
