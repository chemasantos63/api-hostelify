import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformClassToPlain } from 'class-transformer';
import { RoomStatusService } from '../services/room.status.service';
import { RoomStatus } from './../entities/room.status.entity';

@UseGuards(AuthGuard())
@Controller('roomStatus')
export class RoomStatusController {
  constructor(private readonly roomStatusService: RoomStatusService) {}

  @Get()
  @TransformClassToPlain()
  async getStatus(): Promise<RoomStatus[]> {
    const roomStatus = await this.roomStatusService.getAll();

    return roomStatus;
  }
}
