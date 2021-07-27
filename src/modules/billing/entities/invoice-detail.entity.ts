import { Product } from './../../product/entities/product.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity(`invoices_report_detail`)
export class InvoiceDetail extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `varchar`, nullable: false })
  quantity: string;

  @Column({ type: `varchar`, nullable: false })
  description: string;

  @Column({ type: `varchar`, nullable: false })
  roomersQuantity: string;

  @Column({ type: `varchar`, nullable: false })
  unitPrice: string;

  @Column({ type: `varchar`, nullable: false })
  discount: string;

  @Column({ type: `varchar`, nullable: false })
  total: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.detail)
  invoice: Invoice;

  @ManyToOne((type) => Product, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: `product_id` })
  product: Product;

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
