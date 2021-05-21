import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TotalService } from './total.service';
import { TotalController } from './total.controller';
import { TotalRepository } from './total.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TotalRepository])],
  controllers: [TotalController],
  providers: [TotalService],
  exports: [TotalService],
})
export class TotalModule {}
