import { Injectable } from '@nestjs/common';
import { CreateTotalDto } from './dto/create-total.dto';
import { UpdateTotalDto } from './dto/update-total.dto';

@Injectable()
export class TotalService {
  create(createTotalDto: CreateTotalDto) {
    return 'This action adds a new total';
  }

  findAll() {
    return `This action returns all total`;
  }

  findOne(id: number) {
    return `This action returns a #${id} total`;
  }

  update(id: number, updateTotalDto: UpdateTotalDto) {
    return `This action updates a #${id} total`;
  }

  remove(id: number) {
    return `This action removes a #${id} total`;
  }
}
