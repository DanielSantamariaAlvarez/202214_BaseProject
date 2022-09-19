import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaProductoService } from './tienda-producto.service';
import { TiendaProductoController } from './tienda-producto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TiendaEntity, ProductoEntity])],
  providers: [TiendaProductoService],
  controllers: [TiendaProductoController],
})
export class TiendaProductoModule {}
