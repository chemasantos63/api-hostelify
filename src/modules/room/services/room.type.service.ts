import { CreateRoomDto } from '../dto/create-room-input';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Room } from '../entities/room.entity';
import { RoomRepository } from '../repositories/room.repository';
import { RoomTypeRepository } from '../repositories/room.types.repository';
import { RoomType } from '../entities/room.types.entity';

@Injectable()
export class RoomTypeService {
  constructor(private readonly roomTypeRepository: RoomTypeRepository) {}

  async getAll(): Promise<RoomType[]> {
    return await this.roomTypeRepository.find({});
  }
}
