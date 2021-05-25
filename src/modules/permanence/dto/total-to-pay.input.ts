import { IsNotEmpty } from 'class-validator';

export class TotalToPayDto {
  @IsNotEmpty()
  permanencesId: number[];
}
