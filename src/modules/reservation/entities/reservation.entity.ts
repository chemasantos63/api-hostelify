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
import { Guest } from './../../permanence/entities/guest.entity';

@Entity(`reservations`)
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `date`, nullable: false })
  fromDate: Date;

  @Column({ type: `date`, nullable: true })
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

  @ManyToMany(() => Guest, { cascade: true, nullable: true, eager: true })
  @JoinTable({ name: `reservations_guest` })
  guest: Guest[];

  @Column({ type: `varchar`, nullable: false, default: 'active' })
  status: string;

  @Column({ type: `varchar`, nullable: false })
  roomersQty: string;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;
}
