import { Injectable, NotFoundException } from '@nestjs/common';
import { Raw } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { RoomService } from '../room/services/room.service';
import { CreateReservationDto } from './dto/create-reservation.input';
import { UpdateReservationDto } from './dto/update-reservation.input';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './reservation.repository';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly customerService: CustomerService,
    private readonly roomService: RoomService,
  ) {}

  async getAll(): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { status: `active` },
    });
  }

  async getTodayReservations(): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      fromDate: Raw((d) => `${d} = current_date`),
    });
  }

  async get(id: number): Promise<Reservation> {
    const room = await this.reservationRepository.findOne(id, {
      where: { status: `active` },
    });
    if (!room) {
      throw new NotFoundException(`Reservation does not exits`);
    }
    return room;
  }

  async createReservation(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const {
      fromDate,
      toDate,
      customerId,
      roomIds,
      roomersQty,
    } = createReservationDto;

    const customer = await this.customerService.get(customerId);

    const rooms = await this.roomService.getByIds(roomIds);

    const reservation = new Reservation();
    reservation.fromDate = fromDate;
    reservation.toDate = toDate;
    reservation.customer = customer;
    reservation.rooms = rooms;
    reservation.roomersQty = roomersQty;

    return await reservation.save();
  }

  async updateReservation(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ): Promise<void> {
    const {
      fromDate,
      toDate,
      customerId,
      roomIds,
      roomersQty,
    } = updateReservationDto;

    const reservation = await this.get(id);

    const customer = await this.customerService.get(customerId);
    const rooms = await this.roomService.getByIds(roomIds);

    reservation.fromDate = fromDate;
    reservation.toDate = toDate;
    reservation.customer = customer;
    reservation.rooms = rooms;
    reservation.roomersQty = roomersQty;

    await reservation.save();
  }

  async deleteReservation(id: number): Promise<void> {
    await this.get(id);

    await this.reservationRepository.delete(id);
  }
}
