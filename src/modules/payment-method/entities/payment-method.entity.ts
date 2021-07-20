import { Payment } from './../../payment/entities/payment.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(`payment_methods`)
export class PaymentMethod extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `varchar`, length: 60, nullable: false, default: 'active' })
  description: string;

  @Column({ type: `decimal`, nullable: false, default: 1 })
  exchangeRate: number;

  @Column({ type: `varchar`, length: 4, nullable: false })
  symbol: string;

  @OneToMany(() => Payment, (payment) => payment.paymentMethod)
  payments: Payment[];

  @Column({ type: `varchar`, nullable: false, default: 'active' })
  status: string;

  @Column({ type: `boolean`, nullable: false, default: false })
  isCash: boolean;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;

  constructor(partial: Partial<PaymentMethod>) {
    super();
    Object.assign(this, partial);
  }
}
