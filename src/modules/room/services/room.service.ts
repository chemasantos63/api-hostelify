import { CreateRoomDto } from '../dto/create-room-input';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Room } from '../entities/room.entity';
import { RoomRepository } from '../repositories/room.repository';
import { RoomTypeRepository } from '../repositories/room.types.repository';
import { UpdateRoomDto } from '../dto/update-room-input';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly roomTypeRepository: RoomTypeRepository,
  ) {}

  async getAll(): Promise<Room[]> {
    return await this.roomRepository.find({ where: { status: `active` } });
  }

  async getByIds(roomIds: number[]): Promise<Room[]> {
    return await this.roomRepository.findByIds(roomIds);
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

  async updateRoom(id: number, updateRoomDto: UpdateRoomDto): Promise<void> {
    const { roomNumber, roomTypeId, location } = updateRoomDto;

    const room = await this.get(id);

    room.roomNumber = roomNumber;
    room.location = location;
    room.type = await this.roomTypeRepository.findOne({ id: roomTypeId });

    await room.save();
  }

  async deleteRoom(id: number): Promise<void> {
    const room = await this.get(id);

    room.status = `inactive`;

    await this.roomRepository.update(id, room);
  }
}
