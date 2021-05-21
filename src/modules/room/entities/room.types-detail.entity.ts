import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { RoomType } from './room.types.entity';

@Entity(`room_types_detail`)
export class RoomTypeDetail extends BaseEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column({ type: `integer`, nullable: false })
  roomersQuantity: number;

  @Column({ type: `decimal`, nullable: false })
  price: number;

  @ManyToOne((type) => RoomType, (roomType) => roomType.roomTypesDetail)
  @JoinColumn({ name: `roomTypeId` })
  roomType: RoomType;

  @CreateDateColumn({ type: `timestamp`, name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ type: `timestamp`, name: `updated_at` })
  updatedAt: Date;
}
