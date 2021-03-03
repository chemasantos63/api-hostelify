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
import { Customer } from '../customer/customer.entity';
import { Room } from '../room/room.entity';
import { CreateReservationDto } from './dto/create-reservation.input';
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
    console.log(id);
    return new Reservation();
  }

  @Get()
  async getAllReservations(): Promise<Reservation[]> {
    return [new Reservation()];
  }

  @Post()
  @TransformClassToPlain()
  @UsePipes(ValidationPipe)
  async createReservation(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { fromDate, toDate, customerId, rooms } = createReservationDto;
    const reservation = new Reservation();
    reservation.fromDate = fromDate;
    reservation.toDate = toDate;
    reservation.customer = new Customer();
    reservation.rooms = [new Room()];
    return reservation;
  }
}
