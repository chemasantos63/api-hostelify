import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { RoomTypeDetail } from './room.types-detail.entity';

@Entity(`room_types`)
export class RoomType extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `varchar`, unique: true, length: 15, nullable: false })
  type: string;

  @OneToMany(
    (type) => RoomTypeDetail,
    (roomTypeDetail) => roomTypeDetail.roomType,
    { eager: true },
  )
  roomTypesDetail: RoomTypeDetail[];

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;

  @OneToMany((type) => Room, (room) => room.type)
  rooms: Room[];
}
