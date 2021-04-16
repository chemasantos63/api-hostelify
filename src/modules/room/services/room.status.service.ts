import { Injectable } from '@nestjs/common';
import { RoomStatus } from '../entities/room.status.entity';
import { RoomStatusRepository } from '../repositories/room.status.repository';

@Injectable()
export class RoomStatusService {
  constructor(private readonly roomStatusRepository: RoomStatusRepository) {}

  async getAll(): Promise<RoomStatus[]> {
    return await this.roomStatusRepository.find({});
  }
}
