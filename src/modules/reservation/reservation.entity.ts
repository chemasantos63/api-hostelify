import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from '../customer/customer.entity';
import { Room } from '../room/room.entity';

@Entity(`reservations`)
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `int`, unique: true, nullable: false })
  from: Date;

  @OneToOne(() => Customer, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: `customer_id` })
  customer: Customer;

  @ManyToMany(() => Room)
  @JoinTable({ name: `reservations_rooms` })
  rooms: Room[];

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;
}
