import { User } from '../../user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `varchar`, length: 50, nullable: false })
  description: string;

  @Column({ type: `varchar`, length: 25, nullable: false })
  code: string;

  @Column({ type: `decimal`, nullable: false, default: 0 })
  price: number;

  @Column({ type: `decimal`, nullable: false, default: 0 })
  altPrice: number;

  @Column({ type: `decimal`, nullable: false, default: 0 })
  stock: number;

  @ManyToOne((type) => User, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: `created_by` })
  createdBy: User;

  @ManyToOne((type) => User, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: `updated_by` })
  updatedBy: User;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;
}
