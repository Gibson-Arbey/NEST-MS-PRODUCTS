import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');
  onModuleInit() {
    this.$connect();
    this.logger.log('Conexion exitosa a la base de datos');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPage = await this.product.count();
    const lastPage = Math.ceil(totalPage / limit);
    return {
      data: await this.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: { isEnable: true },
      }),
      metaData: {
        totalPage,
        lastPage,
        page,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, isEnable: true },
    });

    if (!product) {
      throw new RpcException({
        message: `El producto con id #${id} no fue encontrado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;

    await this.findOne(id);
    return this.product.update({
      where: { id },
      data: data,
    });
  }

  async delete(id: number) {
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: {
        isEnable: false,
      },
    });
  }

  async validateProduct(ids: number[]) {
    ids = Array.from(new Set(ids));
    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    if (ids.length !== products.length) {
      throw new RpcException({
        message: `No se encontraron ${ids.length - products.length} producto(s)`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return products;
  }
}
