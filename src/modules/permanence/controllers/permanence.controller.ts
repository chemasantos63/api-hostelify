import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformClassToPlain } from 'class-transformer';
import { GetUser } from '../../auth/user.decorator';
import { User } from '../../user/user.entity';
import { CreatePermanenceDto } from '../dto/create-permanence.input';
import { Permanence } from '../entities/permanence.entity';
import { PermanenceService } from '../services/permanence.service';

@UseGuards(AuthGuard())
@Controller('permanences')
export class PermanenceController {
  constructor(private readonly permanenceService: PermanenceService) {}

  @Get()
  @TransformClassToPlain()
  async getPermanence(): Promise<Permanence[]> {
    const permanence = await this.permanenceService.getAll();
    return permanence;
  }

  @Get(`:id`)
  @TransformClassToPlain()
  async getPermanenceById(
    @Param(`id`, ParseIntPipe) id: number,
  ): Promise<Permanence> {
    const permanence = await this.permanenceService.get(id);
    return permanence;
  }

  @Post()
  @TransformClassToPlain()
  @UsePipes()
  async createPermanence(
    @Body() createPermananceDto: CreatePermanenceDto,
    @GetUser() user: User,
  ): Promise<Permanence> {
    const permanence = await this.permanenceService.createPermanence(
      createPermananceDto,
      user,
    );

    return permanence;
  }
}
