import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservationService } from '../../reservation/reservation.service';
import { CreatePermanenceDto } from '../dto/create-permanence.input';
import { Permanence } from '../entities/permanence.entity';
import { PermanenceRepository } from '../repositories/permanence.repository';
import { User } from './../../user/user.entity';
import { GuestService } from './guest.service';

@Injectable()
export class PermanenceService {
  constructor(
    private readonly permanenceRepository: PermanenceRepository,
    private readonly reservationService: ReservationService,
    private readonly guestService: GuestService,
  ) {}

  async getAll(): Promise<Permanence[]> {
    return await this.permanenceRepository.find({});
  }

  async get(id: number): Promise<Permanence> {
    const permanence = this.permanenceRepository.findOne(id);

    if (!permanence) {
      throw new NotFoundException(`Permanence does not exits`);
    }

    return permanence;
  }

  async createPermanence(
    createPermanenceDto: CreatePermanenceDto,
    user: User,
  ): Promise<Permanence> {
    const { idReservation, createGuestDto } = createPermanenceDto;
    const reservation = await this.reservationService.get(idReservation);

    const permanence = new Permanence();
    permanence.customer = reservation.customer;
    permanence.reservation = reservation;
    permanence.guest = await this.guestService.createManyGuest(createGuestDto);
    permanence.checkIn = new Date();
    permanence.userCheckIn = user;

    return permanence.save();
  }

  //   async createGuest(createGuestDto: CreateGuestDto): Promise<Permanence> {
  //     const {m
  //       name,
  //       lastname,
  //       nationality,
  //       origin,
  //       destination,
  //       occupation,
  //       phone,
  //       identification,
  //     } = createGuestDto;

  //     let guest = new Permanence();

  //     guest.name = name;
  //     guest.lastname = lastname;
  //     guest.identification = identification;
  //     guest.occupation = occupation;
  //     guest.origin = origin;
  //     guest.nationality = nationality;
  //     guest.destination = destination;
  //     guest.phone = phone;
  //     guest.permanences = [];

  //     try {
  //       guest = await guest.save();
  //     } catch (e) {
  //       if (e.code === '23505') {
  //         throw new ConflictException(`Guest already has been created`);
  //       } else {
  //         throw new InternalServerErrorException();
  //       }
  //     }

  //     return guest;
  //   }
  //   constructor(
  //   ) {}
  //   async getAll(): Promise<Reservation[]> {
  //     return await this.reservationRepository.find({
  //       where: { status: `active` },
  //     });
  //   }
  //   async getTodayReservations(): Promise<Reservation[]> {
  //     return await this.reservationRepository.find({
  //       fromDate: Raw((d) => `${d} = current_date`),
  //     });
  //   }
  //   async get(id: number): Promise<Reservation> {
  //     const room = await this.reservationRepository.findOne(id, {
  //       where: { status: `active` },
  //     });
  //     if (!room) {
  //       throw new NotFoundException(`Reservation does not exits`);
  //     }
  //     return room;
  //   }
  //   async createReservation(
  //     createReservationDto: CreateReservationDto,
  //   ): Promise<Reservation> {
  //     const {
  //       fromDate,
  //       toDate,
  //       customerId,
  //       roomIds,
  //       roomersQty,
  //     } = createReservationDto;
  //     const customer = await this.customerService.get(customerId);
  //     const rooms = await this.roomService.getByIds(roomIds);
  //     const reservation = new Reservation();
  //     reservation.fromDate = fromDate;
  //     reservation.toDate = toDate;
  //     reservation.customer = customer;
  //     reservation.rooms = rooms;
  //     reservation.roomersQty = roomersQty;
  //     return await reservation.save();
  //   }
  //   async updateReservation(
  //     id: number,
  //     updateReservationDto: UpdateReservationDto,
  //   ): Promise<void> {
  //     const {
  //       fromDate,
  //       toDate,
  //       customerId,
  //       roomIds,
  //       roomersQty,
  //     } = updateReservationDto;
  //     const reservation = await this.get(id);
  //     const customer = await this.customerService.get(customerId);
  //     const rooms = await this.roomService.getByIds(roomIds);
  //     reservation.fromDate = fromDate;
  //     reservation.toDate = toDate;
  //     reservation.customer = customer;
  //     reservation.rooms = rooms;
  //     reservation.roomersQty = roomersQty;
  //     await reservation.save();
  //   }
  //   async deleteReservation(id: number): Promise<void> {
  //     await this.get(id);
  //     await this.reservationRepository.delete(id);
  //   }
}
