import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateFiscalInformationDto } from './dto/create-fiscal-information.dto';
import { UpdateFiscalInformationDto } from './dto/update-fiscal-information.dto';
import { FiscalInformation } from './entities/fiscal-information.entity';
import { FiscalInformationService } from './fiscal-information.service';

@Controller('fiscal-information')
export class FiscalInformationController {
  constructor(
    private readonly fiscalInformationService: FiscalInformationService,
  ) {}

  @Post()
  async create(
    @Body() createFiscalInformationDto: CreateFiscalInformationDto,
  ): Promise<FiscalInformation> {
    return await this.fiscalInformationService.create(
      createFiscalInformationDto,
    );
  }

  @Get()
  async findAll(): Promise<FiscalInformation[]> {
    return await this.fiscalInformationService.findAll();
  }

  @Get('active')
  async findOneActive(): Promise<FiscalInformation> {
    return await this.fiscalInformationService.findOneActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FiscalInformation> {
    return await this.fiscalInformationService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFiscalInformationDto: UpdateFiscalInformationDto,
  ): Promise<void> {
    await this.fiscalInformationService.update(+id, updateFiscalInformationDto);
  }
}
