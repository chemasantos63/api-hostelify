import { EntityRepository, Repository } from 'typeorm';
import { RoomType } from '../entities/room.types.entity';

@EntityRepository(RoomType)
export class RoomTypeRepository extends Repository<RoomType> {}
