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
import { CreateGuestDto } from '../dto/create-guest.input';
import { Guest } from '../entities/guest.entity';
import { GuestService } from '../services/guest.service';

@UseGuards(AuthGuard())
@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Get()
  @TransformClassToPlain()
  async getGuest(): Promise<Guest[]> {
    const guest = await this.guestService.getAll();
    return guest;
  }

  @Get(`:id`)
  @TransformClassToPlain()
  async getGuestById(@Param(`id`, ParseIntPipe) id: number): Promise<Guest> {
    const guest = await this.guestService.get(id);
    return guest;
  }

  @Post()
  @TransformClassToPlain()
  @UsePipes(ValidationPipe)
  async createGuest(@Body() createGuestDto: CreateGuestDto): Promise<Guest> {
    const guest = await this.guestService.createGuest(createGuestDto);
    return guest;
  }
}
