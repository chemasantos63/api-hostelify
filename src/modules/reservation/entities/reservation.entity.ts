import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { Room } from '../../room/entities/room.entity';

@Entity(`reservations`)
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `date`, unique: true, nullable: false })
  fromDate: Date;

  @Column({ type: `date`, unique: true, nullable: false })
  toDate: Date;

  @ManyToOne(() => Customer, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: `customer_id` })
  customer: Customer;

  @ManyToMany(() => Room, { cascade: true, nullable: false, eager: true })
  @JoinTable({ name: `reservations_rooms` })
  rooms: Room[];

  @Column({ type: `varchar`, nullable: false, default: 'active' })
  status: string;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;
}
