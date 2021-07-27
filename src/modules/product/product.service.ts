import { ProductRepository } from './product.repository';
import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const { code } = createProductDto;

    this.validateStockGreaterThanZero(createProductDto);
    this.validatePriceGreaterThanZero(createProductDto);

    const product = await this.productRepository.findOne({ where: { code } });

    if (product) {
      throw new ConflictException(`El producto con codigo ${code} ya existe`);
    }

    const createdProduct = new Product(createProductDto);

    createdProduct.createdBy = user;
    createdProduct.updatedBy = user;

    return createdProduct.save();
  }

  async findAll(): Promise<Array<Product>> {
    const products = this.productRepository.find({});

    return products;
  }

  async findAllActive(): Promise<Array<Product>> {
    const products = this.productRepository.find({
      where: { status: `active` },
    });

    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = this.productRepository.findOne(id);

    if (!product) {
      throw new NotFoundException(`No se encontro el producto con id:${id}`);
    }

    return product;
  }

  async findOneByCode(code: string): Promise<Product> {
    const product = this.productRepository.findOne({ where: { code } });

    if (!product) {
      throw new NotFoundException(
        `No se encontro el producto con codigo:${code}`,
      );
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    user: User,
  ): Promise<Product> {
    this.validateStockGreaterThanZero(updateProductDto);
    this.validatePriceGreaterThanZero(updateProductDto);

    let product = await this.findOne(id);

    product = Object.assign(product, updateProductDto);

    product.updatedBy = user;

    return await product.save();
  }

  private validateStockGreaterThanZero(
    dto: UpdateProductDto | CreateProductDto,
  ): void {
    if ('stock' in dto) {
      const { stock } = dto;

      if (stock < 0) {
        throw new NotAcceptableException(
          'La cantidad no puede ser menor a cero',
        );
      }
    }
  }

  private validatePriceGreaterThanZero(
    dto: UpdateProductDto | CreateProductDto,
  ): void {
    if ('price' in dto) {
      const { price } = dto;

      if (price < 0) {
        throw new NotAcceptableException('El precio no puede ser menor a cero');
      }
    }
  }

  async inactivate(id: number, user: User): Promise<Product> {
    const product = await this.findOne(id);

    product.status = `inactive`;

    product.updatedBy = user;

    return await product.save();
  }
}
