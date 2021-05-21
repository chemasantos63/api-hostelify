import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(`invoice_totals`)
export class Total extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `decimal`, nullable: false, default: 0 })
  subtotal: number;

  @Column({ type: `decimal`, nullable: false, default: 0 })
  taxedAmount: number;

  @Column({ type: `decimal`, nullable: false, default: 0 })
  tax15Amount: number;

  @Column({ type: `decimal`, nullable: false, default: 0 })
  tax18Amount: number;

  @Column({ type: `decimal`, nullable: false, default: 0 })
  tourismTax: number;

  @Column({ type: `decimal`, nullable: false, default: 0 })
  exemptAmount: number;

  @Column({ type: `decimal`, nullable: false, default: 0 })
  total: number;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;

  constructor(partial?: Partial<Total>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }

    this.subtotal = this.total = this.tax15Amount = this.taxedAmount = this.tax18Amount = this.taxedAmount = this.exemptAmount = this.tourismTax = 0;
  }
}
