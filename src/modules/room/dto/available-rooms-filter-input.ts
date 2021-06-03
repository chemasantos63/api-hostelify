import { IsDateString } from 'class-validator';

export class AvailableRoomsFilterDto {
  @IsDateString()
  fromDate: string;

  @IsDateString()
  toDate: string;
}
