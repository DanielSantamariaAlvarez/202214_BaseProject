import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/interceptor';
import { ProductoDTO } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get()
  async findAllProducts() {
    return await this.productoService.findAll();
  }

  @Get(':productoId')
  async findOneProduct(@Param('productoId') productoId: string) {
    return await this.productoService.findOne(productoId);
  }

  @Post()
  @HttpCode(201)
  async createProduct(@Body() productoDTO: ProductoDTO) {
    const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDTO);
    return await this.productoService.create(producto);
  }

  @Put(':productoId')
  async updateProduct(
    @Param('productoId') productoId: string,
    @Body() productoDTO: ProductoDTO,
  ) {
    const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDTO);
    return await this.productoService.update(productoId, producto);
  }

  @Delete(':productoId')
  @HttpCode(204)
  async deleteProduct(@Param('productoId') productoId: string) {
    return await this.productoService.delete(productoId);
  }
}
