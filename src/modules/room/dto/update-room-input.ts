import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateRoomDto {
  @IsNotEmpty()
  @IsNumber()
  roomNumber: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  roomTypeId: number;
}
