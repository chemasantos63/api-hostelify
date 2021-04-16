import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GuestRepository } from './repositories/guest.repository';
import { PermanenceRepository } from './repositories/permanence.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([PermanenceRepository, GuestRepository]),
  ],
  providers: [],
  controllers: [],
})
export class PermanenceModule {}
