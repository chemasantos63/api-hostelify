import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFiscalInformationDto } from './dto/create-fiscal-information.dto';
import { UpdateFiscalInformationDto } from './dto/update-fiscal-information.dto';
import { FiscalInformation } from './entities/fiscal-information.entity';
import { FiscalInformationRepository } from './fiscal-information.repository';

@Injectable()
export class FiscalInformationService {
  constructor(
    private readonly fiscalInfortionRepository: FiscalInformationRepository,
  ) {}

  async create(
    createFiscalInformationDto: CreateFiscalInformationDto,
  ): Promise<FiscalInformation> {
    const fiscalInformation = new FiscalInformation(createFiscalInformationDto);
    return await fiscalInformation.save();
  }

  async findAll(): Promise<FiscalInformation[]> {
    return await this.fiscalInfortionRepository.find({});
  }

  async findOne(id: number): Promise<FiscalInformation> {
    return await this.fiscalInfortionRepository.findOne({ id });
  }

  async update(
    id: number,
    updateFiscalInformationDto: UpdateFiscalInformationDto,
  ): Promise<void> {
    await this.fiscalInfortionRepository.update(
      { id },
      updateFiscalInformationDto,
    );
  }

  async findOneActive(): Promise<FiscalInformation> {
    const fiscalInformationActive = await this.fiscalInfortionRepository
      .createQueryBuilder('fiscalInfo')
      .where(
        'current_date BETWEEN fiscalInfo.dateValidFrom AND fiscalInfo.dateValidTo',
      )
      .andWhere(
        'fiscalInfo.currentNumber BETWEEN fiscalInfo.begin AND (fiscalInfo.end - 1)',
      )
      .getOne();

    if (!fiscalInformationActive) {
      throw new NotFoundException(`No se encontro informacion fiscal activa`);
    }

    return fiscalInformationActive;
  }
}
