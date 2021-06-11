import { RoomType } from './../entities/room.types.entity';
import { AvailableRoomsFilterDto } from './../dto/available-rooms-filter-input';
import { CreateRoomDto } from '../dto/create-room-input';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Room } from '../entities/room.entity';
import { RoomRepository } from '../repositories/room.repository';
import { RoomTypeRepository } from '../repositories/room.types.repository';
import { UpdateRoomDto } from '../dto/update-room-input';
import { RoomStatusRepository } from '../repositories/room.status.repository';
import { getRepository, Not, EntityManager } from 'typeorm';
import { getManager } from 'typeorm';
@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly roomTypeRepository: RoomTypeRepository,
    private readonly roomStatusRepository: RoomStatusRepository,
  ) {}

  async getAll(): Promise<Room[]> {
    const inactiveRoomStatus = await this.roomStatusRepository.findOne({
      where: { description: 'Inactiva' },
    });

    return await this.roomRepository.find({
      status: { id: Not(inactiveRoomStatus.id) },
    });
  }

  async getByIds(roomIds: number[]): Promise<Room[]> {
    return await this.roomRepository.findByIds(roomIds);
  }

  async get(id: number): Promise<Room> {
    const inactiveRoomStatus = await this.roomStatusRepository.findOne({
      where: { description: 'Inactiva' },
    });

    const room = await this.roomRepository.findOne(id, {
      where: { status: { id: Not(inactiveRoomStatus.id) } },
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
    room.status = await this.roomStatusRepository.findOne({
      description: `Disponible`,
    });

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

    room.status = await this.roomStatusRepository.findOne({
      description: `Inactiva`,
    });

    await this.roomRepository.update(id, room);
  }

  async setRoomStatus(
    room: Room,
    status: string,
    manager?: EntityManager,
  ): Promise<void> {
    room.status = await this.roomStatusRepository.findOne({
      description: status,
    });

    manager ? await manager.save(room) : await room.save();
  }

  async getAvailableRooms(filter: AvailableRoomsFilterDto): Promise<Room[]> {
    const reservationsOnDateRange = this.roomRepository.manager.connection
      .createQueryBuilder()
      .select('rr.roomsId')
      .from('reservations', 'rs')
      .innerJoin('reservations_rooms', 'rr', 'rs.id = rr.reservationsId')
      .where('rs.fromDate >= :fromDate AND rs.toDate <= :toDate ')
      .orWhere('rs.toDate > :fromDate AND rs.toDate < :toDate')
      .orWhere('rs.fromDate > :fromDate AND rs.fromDate < :toDate')
      .setParameters(filter);

    const availableRooms = this.roomRepository.manager.connection
      .createQueryBuilder(Room, 'r')
      .innerJoinAndSelect(`r.type`, `roomTypes`)
      .innerJoinAndSelect(`r.status`, `roomStatus`)
      .where(`r.id NOT IN (${reservationsOnDateRange.getQuery()})`)
      .setParameters(filter);

    const rooms = await availableRooms.getMany();

    return rooms;
  }
}
