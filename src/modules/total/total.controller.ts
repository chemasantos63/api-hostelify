import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { TotalService } from './total.service';
import { CreateTotalDto } from './dto/create-total.dto';
import { UpdateTotalDto } from './dto/update-total.dto';

@Controller('total')
export class TotalController {
  constructor(private readonly totalService: TotalService) {}

  @Post()
  create(@Body() createTotalDto: CreateTotalDto) {
    return this.totalService.create(createTotalDto);
  }

  @Get()
  findAll() {
    return this.totalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.totalService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTotalDto: UpdateTotalDto) {
    return this.totalService.update(+id, updateTotalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.totalService.remove(+id);
  }
}
