import { Billing } from './../../billing/entities/billing.entity';
import { PaymentMethod } from './../../payment-method/entities/payment-method.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(`payment`)
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @ManyToOne((type) => PaymentMethod, (paymentMethod) => paymentMethod.payments)
  @JoinColumn({ name: `payment_method_id` })
  paymentMethod: PaymentMethod;

  @ManyToOne(() => Billing, (invoice) => invoice.payments, {
    cascade: true,
    nullable: true,
  })
  invoice: Billing;

  @Column({ type: `decimal`, nullable: false, default: 0 })
  amount: number;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;

  constructor(partial: Partial<Payment>) {
    super();
    Object.assign(this, partial);
  }
}
