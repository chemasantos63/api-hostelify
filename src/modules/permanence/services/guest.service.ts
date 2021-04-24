import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGuestDto } from '../dto/create-guest.input';
import { Guest } from '../entities/guest.entity';
import { GuestRepository } from '../repositories/guest.repository';

@Injectable()
export class GuestService {
  constructor(private readonly guestRepository: GuestRepository) {}

  async getAll(): Promise<Guest[]> {
    return await this.guestRepository.find({});
  }

  async get(id: number): Promise<Guest> {
    const guest = this.guestRepository.findOne(id);

    if (!guest) {
      throw new NotFoundException(`Guest does not exits`);
    }

    return guest;
  }

  async createGuest(createGuestDto: CreateGuestDto): Promise<Guest> {
    let guest = this.createGuestEntityFromDto(createGuestDto);

    try {
      guest = await guest.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException(`Guest already has been created`);
      } else {
        throw new InternalServerErrorException();
      }
    }

    return guest;
  }

  private createGuestEntityFromDto(createGuestDto: CreateGuestDto) {
    const {
      name,
      lastname,
      nationality,
      origin,
      destination,
      occupation,
      phone,
      identification,
    } = createGuestDto;

    const guest = new Guest();

    guest.name = name;
    guest.lastname = lastname;
    guest.identification = identification;
    guest.occupation = occupation;
    guest.origin = origin;
    guest.nationality = nationality;
    guest.destination = destination;
    guest.phone = phone;

    return guest;
  }

  private createArrayOfGuestEntitiesFromArrayOfDto(
    createGuestDto: CreateGuestDto[],
  ): Guest[] {
    return createGuestDto.map((guestDto) =>
      this.createGuestEntityFromDto(guestDto),
    );
  }

  async createManyGuest(createGuestDto: CreateGuestDto[]): Promise<Guest[]> {
    const arrayOfGuestEntities = this.createArrayOfGuestEntitiesFromArrayOfDto(
      createGuestDto,
    );

    try {
      await this.guestRepository.save(arrayOfGuestEntities);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException(`Guest already has been created`);
      } else {
        throw new InternalServerErrorException();
      }
    }

    return arrayOfGuestEntities;
  }
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
