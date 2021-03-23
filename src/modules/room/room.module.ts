import { RoomStatusRepository } from './repositories/room.status.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RoomRepository } from './repositories/room.repository';
import { RoomTypeRepository } from './repositories/room.types.repository';
import { RoomService } from './services/room.service';
import { RoomController } from './controllers/room.controller';
import { RoomTypeController } from './controllers/room.type.controller';
import { RoomTypeService } from './services/room.type.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      RoomRepository,
      RoomTypeRepository,
      RoomStatusRepository,
    ]),
  ],
  providers: [RoomService, RoomTypeService],
  controllers: [RoomController, RoomTypeController],
})
export class RoomModule {}
