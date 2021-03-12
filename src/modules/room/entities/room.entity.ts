import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoomType } from './room.types.entity';

@Entity(`rooms`)
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `int`, unique: true, nullable: false })
  roomNumber: number;

  @Column({ type: `varchar`, unique: false, length: 60, nullable: true })
  location: string;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  type: RoomType;

  @Column({ type: `varchar`, nullable: false, default: 'active' })
  status: string;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;
}