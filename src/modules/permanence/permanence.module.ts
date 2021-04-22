import { GuestService } from './services/guest.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GuestController } from './controllers/guest.controller';
import { GuestRepository } from './repositories/guest.repository';
import { PermanenceRepository } from './repositories/permanence.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([PermanenceRepository, GuestRepository]),
  ],
  providers: [GuestService],
  controllers: [GuestController],
})
export class PermanenceModule {}
