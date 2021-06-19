import { Role } from './../role/role.entity';
import { UserDetails } from './user.details.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Permanence } from '../permanence/entities/permanence.entity';
import { Balance } from '../balance/entities/balance.entity';
@Entity(`users`)
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `varchar`, length: 30, nullable: false })
  username: string;

  @Column({ type: `varchar`, nullable: false })
  email: string;

  @Column({ type: `varchar`, nullable: false })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', nullable: false })
  @Exclude()
  salt: string;

  @OneToOne((type) => UserDetails, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: `detail_id` })
  details: UserDetails;

  @ManyToMany((type) => Role, (role) => role.users, { eager: true })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @OneToMany(() => Permanence, (permanence) => permanence.userCheckIn)
  permanencesIn: Permanence[];

  @OneToMany(() => Permanence, (permanence) => permanence.userCheckOut)
  permanencesOut: Permanence[];

  @OneToMany(() => Balance, (balance) => balance.user)
  balances: Balance[];

  @Column({ type: `varchar`, default: `ACTIVE`, length: 8 })
  status: string;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;
}
