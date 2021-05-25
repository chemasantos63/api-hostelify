import { TotalService } from './../../total/total.service';
import { BillingService } from './../../billing/billing.service';
import { Room } from './../../room/entities/room.entity';
import { RoomService } from './../../room/services/room.service';
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
    private readonly roomService: RoomService,
    private readonly totalService: TotalService,
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
    const { idReservation, guestIds } = createPermanenceDto;
    const reservation = await this.reservationService.get(idReservation);
    const guest = await this.guestService.getAll();

    const permanence = new Permanence();

    permanence.guest = guest.filter((g) => guestIds.includes(g.id));

    permanence.customer = reservation.customer;
    permanence.reservation = reservation;

    permanence.checkIn = new Date();
    permanence.userCheckIn = user;

    for (const room of reservation.rooms) {
      await this.roomService.setRoomAsTaken(room);
    }

    return permanence.save();
  }

  async getTotalToPayByPermanencesId(permanencesId: number[]): Promise<any> {
    const permanences = await this.permanenceRepository.findByIds(
      permanencesId,
    );

    if (permanences.length === 0) {
      throw new NotFoundException(
        `No se encontraron permanencias con los siguientes id:${permanencesId.reduce(
          (act, acc) => `${acc},${act}`,
          '',
        )}`,
      );
    }

    const total = await this.totalService.create(
      { permanences },
      undefined,
      true,
    );

    return { total: total.total };
  }
}
