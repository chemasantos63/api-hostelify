import { Injectable } from '@nestjs/common';
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

  update(id: number, updateFiscalInformationDto: UpdateFiscalInformationDto) {
    return `This action updates a #${id} fiscalInformation`;
  }

  remove(id: number) {
    return `This action removes a #${id} fiscalInformation`;
  }
}
