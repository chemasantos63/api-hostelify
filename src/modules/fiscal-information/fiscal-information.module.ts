import { FiscalInformationRepository } from './fiscal-information.repository';
import { Module } from '@nestjs/common';
import { FiscalInformationService } from './fiscal-information.service';
import { FiscalInformationController } from './fiscal-information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FiscalInformationRepository])],
  controllers: [FiscalInformationController],
  providers: [FiscalInformationService],
  exports: [FiscalInformationService],
})
export class FiscalInformationModule {}
