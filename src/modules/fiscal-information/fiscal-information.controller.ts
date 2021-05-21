import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { FiscalInformationService } from './fiscal-information.service';
import { CreateFiscalInformationDto } from './dto/create-fiscal-information.dto';
import { UpdateFiscalInformationDto } from './dto/update-fiscal-information.dto';
import { FiscalInformation } from './entities/fiscal-information.entity';

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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FiscalInformation> {
    return await this.fiscalInformationService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFiscalInformationDto: UpdateFiscalInformationDto,
  ) {
    return this.fiscalInformationService.update(
      +id,
      updateFiscalInformationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fiscalInformationService.remove(+id);
  }
}
