import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ReservationRepository])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
