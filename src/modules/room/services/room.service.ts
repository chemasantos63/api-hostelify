import { CreateRoomDto } from '../dto/create-room-input';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Room } from '../entities/room.entity';
import { RoomRepository } from '../repositories/room.repository';
import { RoomTypeRepository } from '../repositories/room.types.repository';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly roomTypeRepository: RoomTypeRepository,
  ) {}

  async getAll(): Promise<Room[]> {
    return await this.roomRepository.find({});
  }

  async get(id: number): Promise<Room> {
    const room = await this.roomRepository.findOne(id, {
      where: { status: `active` },
    });
    if (!room) {
      throw new NotFoundException(`Room does not exits`);
    }
    return room;
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const { roomNumber, roomTypeId, location } = createRoomDto;

    const room = new Room();

    room.roomNumber = roomNumber;
    room.location = location;
    room.type = await this.roomTypeRepository.findOne({ id: roomTypeId });

    return await room.save();
  }
}
