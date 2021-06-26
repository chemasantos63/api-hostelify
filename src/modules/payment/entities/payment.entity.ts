import { Balance } from './../../balance/entities/balance.entity';
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
import { Billing } from './../../billing/entities/billing.entity';
import { PaymentMethod } from './../../payment-method/entities/payment-method.entity';

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

  @ManyToOne((type) => Balance, (balance) => balance.payments)
  @JoinColumn({ name: `balance_id` })
  balance: Balance;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;

  constructor(partial: Partial<Payment>) {
    super();
    Object.assign(this, partial);
  }
}
