import { BalanceRepository } from './balance.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { Balance } from './entities/balance.entity';
import { User } from '../user/user.entity';

@Injectable()
export class BalanceService {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  async create(
    createBalanceDto: CreateBalanceDto,
    user: User,
  ): Promise<Balance> {
    const balance = new Balance({ ...createBalanceDto, user });

    return balance.save();
  }

  async findAll(): Promise<Balance[]> {
    const balances = await this.balanceRepository.find({});
    return balances;
  }

  async findOne(id: number): Promise<Balance> {
    const balance = await this.balanceRepository.findOne({ id });

    if (!balance) {
      throw new NotFoundException(`El cierre con id ${id} no se encuentra`);
    }

    return balance;
  }

  async findByUser(user: User): Promise<Balance[]> {
    const balances = await this.balanceRepository.find({
      where: { user },
      order: { createdAt: 'DESC' },
    });

    if (!balances) {
      throw new NotFoundException(
        `El usuario ${user.username} no tiene cierres registrados`,
      );
    }

    return balances;
  }

  async update(
    id: number,
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<Balance> {
    const { cashTotal, cardTotal } = updateBalanceDto;
    const balance = await this.findOne(id);

    balance.cashTotal = cashTotal;
    balance.cardTotal = cardTotal;
    balance.closingDate = new Date();

    return balance.save();
  }

  remove(id: number) {
    return `This action removes a #${id} balance`;
  }
}
