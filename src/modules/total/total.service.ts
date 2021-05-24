import { PermanenceService } from './../permanence/services/permanence.service';
import { Injectable } from '@nestjs/common';
import { CreateTotalDto } from './dto/create-total.dto';
import { UpdateTotalDto } from './dto/update-total.dto';
import { Total } from './entities/total.entity';
import { TotalRepository } from './total.repository';
import BigNumber from 'bignumber.js';
import { EntityManager } from 'typeorm';

@Injectable()
export class TotalService {
  constructor(private readonly totalRepository: TotalRepository) {}

  async create(
    createTotalDto: CreateTotalDto,
    manager?: EntityManager,
  ): Promise<Total> {
    const total = new Total();

    for (const permanence of createTotalDto.permanences) {
      for (const room of permanence.reservation.rooms) {
        const totalToPay = room.type.roomTypesDetail.find(
          (rtd) => rtd.roomersQuantity === +permanence.reservation.roomersQty,
        ).price;

        total.subtotal += +totalToPay;
      }
    }

    total.taxedAmount = this.roundNumber(+total.subtotal);
    total.tax15Amount = this.roundNumber(total.subtotal * 0.15);
    total.tax18Amount = 0;
    total.tourismTax = this.roundNumber(total.subtotal * 0.04);
    total.total = this.roundNumber(
      +total.subtotal +
        +total.tax15Amount +
        +total.tax18Amount +
        +total.tourismTax,
    );

    return manager ? await manager.save(total) : total.save();
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

  private roundNumber(nmbr: number): number {
    const bigNumberConvert = new BigNumber(nmbr);
    // console.log(
    //   `antes de redondear:${nmbr} despues de redondear:${bigNumberConvert
    //     .precision(12, BigNumber.ROUND_HALF_UP)
    //     .toFixed(0)}`,
    // );
    return +bigNumberConvert.precision(12, BigNumber.ROUND_HALF_UP).toFixed(0);
  }
}
