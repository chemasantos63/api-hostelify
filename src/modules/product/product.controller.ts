import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformClassToPlain } from 'class-transformer';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@UseGuards(AuthGuard())
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @TransformClassToPlain()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ): Promise<Product> {
    return await this.productService.create(createProductDto, user);
  }

  @Get()
  async findAll(): Promise<Array<Product>> {
    return await this.productService.findAll();
  }

  @Get('active')
  async findAllActive(): Promise<Array<Product>> {
    return await this.productService.findAllActive();
  }

  @Get('byCode/:code')
  async findByCode(@Param(`code`) code: string): Promise<Product> {
    return await this.productService.findOneByCode(code);
  }

  @Get(':id')
  async findOne(@Param(`id`, ParseIntPipe) id: number): Promise<Product> {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  @TransformClassToPlain()
  @UsePipes(ValidationPipe)
  async update(
    @Param(`id`, ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ): Promise<Product> {
    return await this.productService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  async inactivate(
    @Param(`id`, ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Product> {
    return await this.productService.inactivate(id, user);
  }
}
