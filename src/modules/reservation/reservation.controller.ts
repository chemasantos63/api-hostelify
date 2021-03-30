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
import { CreateReservationDto } from './dto/create-reservation.input';
import { UpdateReservationDto } from './dto/update-reservation.input';
import { Reservation } from './entities/reservation.entity';
import { ReservationService } from './reservation.service';

@UseGuards(AuthGuard())
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get(`:id`)
  async getReservationById(
    @Param(`id`, ParseIntPipe) id: number,
  ): Promise<Reservation> {
    return await this.reservationService.get(id);
  }

  @Get()
  async getAllReservations(): Promise<Reservation[]> {
    return await this.reservationService.getAll();
  }

  @Post()
  @TransformClassToPlain()
  @UsePipes(ValidationPipe)
  async createReservation(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    return await this.reservationService.createReservation(
      createReservationDto,
    );
  }

  @Patch(`:id`)
  @TransformClassToPlain()
  @UsePipes(ValidationPipe)
  async updateCustomer(
    @Body() updateReservationDto: UpdateReservationDto,
    @Param(`id`, ParseIntPipe) id: number,
  ): Promise<void> {
    return this.reservationService.updateReservation(id, updateReservationDto);
  }

  @Delete(`:id`)
  async deleteReservation(
    @Param(`id`, ParseIntPipe) id: number,
  ): Promise<boolean> {
    await this.reservationService.deleteReservation(id);
    return true;
  }
}
