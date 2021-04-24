import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CustomerRepository } from '../customer/customer.repository';
import { CustomerService } from '../customer/customer.service';
import { CustomerTypesRepository } from '../customer/customer.types.repository';
import { RoomRepository } from '../room/repositories/room.repository';
import { RoomStatusRepository } from '../room/repositories/room.status.repository';
import { RoomTypeRepository } from '../room/repositories/room.types.repository';
import { RoomService } from '../room/services/room.service';
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ReservationRepository,
      CustomerRepository,
      RoomRepository,
      CustomerTypesRepository,
      RoomTypeRepository,
      RoomStatusRepository,
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, CustomerService, RoomService],
  exports: [ReservationService],
})
export class ReservationModule {}
