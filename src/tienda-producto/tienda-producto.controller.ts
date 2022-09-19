import {
  Get,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { TiendaDTO } from '../tienda/tienda.dto';
import { TiendaEntity } from '../tienda/tienda.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/interceptor';
import { TiendaProductoService } from './tienda-producto.service';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaProductoController {
  constructor(private readonly tiendaProductoService: TiendaProductoService) {}

  @Post(':productoId/tiendas/:tiendaId')
  @HttpCode(201)
  async addStoreToProduct(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return await this.tiendaProductoService.addStoreToProducto(productoId, tiendaId);
  }

  @Get(':productoId/tiendas')
  async findAllStoresByProduct(@Param('productoId') productoId: string) {
    return await this.tiendaProductoService.findStoresFromProducto(productoId);
  }

  @Get(':productoId/tiendas/:tiendaId')
  async findOneStoreByProduct(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return await this.tiendaProductoService.findStoreFromProducto(
      productoId,
      tiendaId,
    );
  }

  @Put(':productoId/tiendas')
  async updateStoresByProduct(
    @Param('productoId') productoId: string,
    @Body() storeDTO: TiendaDTO[],
  ) {
    const tiendas = plainToInstance(TiendaEntity, storeDTO);
    return await this.tiendaProductoService.updateStoresFromProducto(
      productoId,
      tiendas,
    );
  }

  @Delete(':productoId/tiendas/:tiendaId')
  @HttpCode(204)
  async deleteStoreByProduct(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return await this.tiendaProductoService.deleteStoreFromProducto(
      productoId,
      tiendaId,
    );
  }
}
