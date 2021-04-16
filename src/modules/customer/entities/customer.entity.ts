import { Permanence } from '../../permanence/entities/permanence.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { CustomerType } from './customer.types.entity';

@Entity(`customers`)
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `varchar`, unique: false, length: 35, nullable: false })
  name: string;

  @Column({ type: `varchar`, unique: false, length: 35, nullable: false })
  lastname: string;

  @Column({ type: `varchar`, unique: true, length: 60, nullable: false })
  documentNumber: string;

  @Column({ type: `varchar`, unique: false, length: 30, nullable: false })
  phone: string;

  @Column({ type: `varchar`, unique: false, length: 30, nullable: false })
  email: string;

  @ManyToOne(() => CustomerType, (customerType) => customerType.customers, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: `type_id` })
  type: CustomerType;

  @OneToMany(() => Reservation, (reservation) => reservation.customer)
  reservations: Reservation[];

  @OneToMany(() => Permanence, (permanence) => permanence.customer)
  permanences: Permanence[];

  @Column({ type: `varchar`, nullable: false, default: 'active' })
  status: string;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;
}
