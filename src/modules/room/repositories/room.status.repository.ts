import { RoomStatus } from './../entities/room.status.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(RoomStatus)
export class RoomStatusRepository extends Repository<RoomStatus> {}
