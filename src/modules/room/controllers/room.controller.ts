import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformClassToPlain } from 'class-transformer';
import { CreateRoomDto } from '../dto/create-room-input';
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
  async getCustomer(@Param(`id`, ParseIntPipe) id: number): Promise<Room> {
    const room = await this.roomService.get(id);

    return room;
  }

  @Post()
  @TransformClassToPlain()
  @UsePipes(ValidationPipe)
  async createCustomer(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    const createdRoom = await this.roomService.createRoom(createRoomDto);
    return createdRoom;
  }

  //   @Patch(`:id`)
  //   @TransformClassToPlain()
  //   @UsePipes(ValidationPipe)
  //   async updateCustomer(
  //     @Body() updateCustomerDto: UpdateCustomerDto,
  //     @Param(`id`, ParseIntPipe) id: number,
  //   ): Promise<void> {
  //     return this.customerService.updateCustomer(id, updateCustomerDto);
  //   }

  //   @Delete(`:id`)
  //   async deleteUser(@Param(`id`, ParseIntPipe) id: number): Promise<boolean> {
  //     await this.customerService.deleteCustomer(id);
  //     return true;
  //   }
}
