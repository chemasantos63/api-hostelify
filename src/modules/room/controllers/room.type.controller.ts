import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { TransformClassToPlain } from 'class-transformer';
import { RoomType } from '../entities/room.types.entity';
import { RoomTypeService } from '../services/room.type.service';

@UseGuards(AuthGuard())
@Controller('roomTypes')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @Get()
  @TransformClassToPlain()
  async getRooms(): Promise<RoomType[]> {
    const roomTypes = await this.roomTypeService.getAll();

    return roomTypes;
  }
}
