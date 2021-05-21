import { PartialType } from '@nestjs/mapped-types';
import { CreateFiscalInformationDto } from './create-fiscal-information.dto';

export class UpdateFiscalInformationDto extends PartialType(CreateFiscalInformationDto) {}
