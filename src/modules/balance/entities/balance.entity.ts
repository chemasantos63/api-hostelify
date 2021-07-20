import { User } from './../../user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Billing } from './../../billing/entities/billing.entity';
import { Payment } from './../../payment/entities/payment.entity';
import { type } from 'os';

@Entity(`balances`)
export class Balance extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @OneToMany(() => Billing, (invoice) => invoice.balance, { eager: true })
  invoices: Billing[];

  @OneToMany(() => Payment, (payment) => payment.balance, { eager: true })
  payments: Payment[];

  @Column({ type: `decimal`, nullable: true, default: 0 })
  initialBalance: number;

  @Column({ type: `decimal`, nullable: true, default: 0 })
  cashTotal: number;

  @Column({ type: `decimal`, nullable: true, default: 0 })
  debitTotal: number;

  @ManyToOne((type) => User, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: `user_id` })
  user: User;

  @Column({ type: `timestamp`, nullable: true })
  closingDate: Date;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;

  constructor(partial?: Partial<Balance>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
