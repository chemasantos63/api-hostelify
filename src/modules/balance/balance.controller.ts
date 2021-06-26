import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/user.entity';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { Balance } from './entities/balance.entity';

@Controller('balance')
@UseGuards(AuthGuard())
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post()
  async create(
    @Body() createBalanceDto: CreateBalanceDto,
    @GetUser() user: User,
  ): Promise<Balance> {
    return await this.balanceService.create(createBalanceDto, user);
  }

  @Get()
  async findAll(): Promise<Balance[]> {
    return await this.balanceService.findAll();
  }

  @Get(`/byUser`)
  async findAllByUser(@GetUser() user: User): Promise<Balance[]> {
    return await this.balanceService.findByUser(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Balance> {
    return await this.balanceService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ): Promise<Balance> {
    return this.balanceService.update(+id, updateBalanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.balanceService.remove(+id);
  }
}
