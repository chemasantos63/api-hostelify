import { Injectable } from '@nestjs/common';
import { RoomType } from '../entities/room.types.entity';
import { RoomTypeRepository } from '../repositories/room.types.repository';

@Injectable()
export class RoomTypeService {
  constructor(private readonly roomTypeRepository: RoomTypeRepository) {}

  async getAll(): Promise<RoomType[]> {
    return await this.roomTypeRepository.find({});
  }
}
