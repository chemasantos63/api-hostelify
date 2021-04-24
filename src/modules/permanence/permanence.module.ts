import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ReservationModule } from '../reservation/reservation.module';
import { GuestController } from './controllers/guest.controller';
import { PermanenceController } from './controllers/permanence.controller';
import { GuestRepository } from './repositories/guest.repository';
import { PermanenceRepository } from './repositories/permanence.repository';
import { GuestService } from './services/guest.service';
import { PermanenceService } from './services/permanence.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([PermanenceRepository, GuestRepository]),
    ReservationModule,
  ],
  providers: [GuestService, PermanenceService],
  controllers: [GuestController, PermanenceController],
})
export class PermanenceModule {}
