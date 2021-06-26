import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/user.entity';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { Billing } from './entities/billing.entity';

@Controller('billing')
@UseGuards(AuthGuard())
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  async create(
    @Body() createBillingDto: CreateBillingDto,
    @GetUser() user: User,
  ): Promise<Billing> {
    return await this.billingService.create(createBillingDto, user);
  }

  @Get()
  async findAll(): Promise<Billing[]> {
    return await this.billingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billingService.findOne(+id);
  }

  @Get(`/invoicePdf/:id`)
  @Header('Content-Type', `application/pdf`)
  async getInvoicePdf(
    @Param('id') id: string,
    @GetUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    const pdf = await this.billingService.createInvoicePdf(user, +id);

    res.end(pdf);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBillingDto: UpdateBillingDto) {
    return this.billingService.update(+id, updateBillingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billingService.remove(+id);
  }
}
