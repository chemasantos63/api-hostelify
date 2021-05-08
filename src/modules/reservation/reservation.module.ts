import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CustomerService } from '../customer/customer.service';
import { PermanenceModule } from '../permanence/permanence.module';
import { RoomService } from '../room/services/room.service';
import { CustomerModule } from './../customer/customer.module';
import { RoomModule } from './../room/room.module';
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ReservationRepository]),
    forwardRef(() => PermanenceModule),
    CustomerModule,
    RoomModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
