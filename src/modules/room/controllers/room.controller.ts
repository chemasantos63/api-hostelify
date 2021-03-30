import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformClassToPlain } from 'class-transformer';
import { CreateRoomDto } from '../dto/create-room-input';
import { UpdateRoomDto } from '../dto/update-room-input';
import { Room } from '../entities/room.entity';
import { RoomService } from '../services/room.service';

@UseGuards(AuthGuard())
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  @Get()
  @TransformClassToPlain()
  async getRooms(): Promise<Room[]> {
    const rooms = await this.roomService.getAll();

    return rooms;
  }

  @Get(`:id`)
  @TransformClassToPlain()
  async getRoom(@Param(`id`, ParseIntPipe) id: number): Promise<Room> {
    const room = await this.roomService.get(id);

    return room;
  }

  @Post()
  @TransformClassToPlain()
  @UsePipes(ValidationPipe)
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    const createdRoom = await this.roomService.createRoom(createRoomDto);
    return createdRoom;
  }

  @Patch(`:id`)
  @TransformClassToPlain()
  @UsePipes(ValidationPipe)
  async updateRoom(
    @Body() updateRoomDto: UpdateRoomDto,
    @Param(`id`, ParseIntPipe) id: number,
  ): Promise<void> {
    return this.roomService.updateRoom(id, updateRoomDto);
  }

  @Delete(`:id`)
  async deleteRoom(@Param(`id`, ParseIntPipe) id: number): Promise<boolean> {
    await this.roomService.deleteRoom(id);
    return true;
  }
}
