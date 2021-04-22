import { Customer } from '../../customer/entities/customer.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { User } from '../../user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Guest } from './guest.entity';

@Entity(`permanences`)
export class Permanence extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.permanences, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: `customer_id` })
  customer: Customer;

  @OneToOne((type) => Reservation, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: `reservation_id` })
  reservation: Reservation;

  @Column({ type: `timestamp`, unique: false, nullable: false })
  checkIn: Date;

  @Column({ type: `timestamp`, unique: false, nullable: false })
  checkOut: Date;

  @ManyToOne(() => User, (user) => user.permanencesIn, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: `userCheckIn_id` })
  userCheckIn: User;

  @ManyToOne(() => User, (user) => user.permanencesOut, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: `userCheckOut_id` })
  userCheckOut: User;

  @ManyToMany(() => Guest, (guest) => guest.permanences, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinTable({ name: `permanences_guest` })
  guest: Guest[];

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;
}
