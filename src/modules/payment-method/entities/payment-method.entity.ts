import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ type: `varchar`, length: 4, nullable: false, default: 'active' })
  symbol: string;

  @Column({ type: `varchar`, nullable: false, default: 'active' })
  status: string;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;

  constructor(partial: Partial<PaymentMethod>) {
    super();
    Object.assign(this, partial);
  }
}
