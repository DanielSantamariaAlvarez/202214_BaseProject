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
import { TiendaDTO } from './tienda.dto';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';

@Controller('tiendas')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaController {
  constructor(private readonly tiendaService: TiendaService) {}

  @Get()
  async findAllStores() {
    return await this.tiendaService.findAll();
  }

  @Get(':tiendaId')
  async findOneStore(@Param('tiendaId') tiendaId: string) {
    return await this.tiendaService.findOne(tiendaId);
  }

  @Post()
  @HttpCode(201)
  async createStore(@Body() storeDTO: TiendaDTO) {
    const store: TiendaEntity = plainToInstance(TiendaEntity, storeDTO);
    return await this.tiendaService.create(store);
  }

  @Put(':tiendaId')
  async updateStore(
    @Param('tiendaId') tiendaId: string,
    @Body() storeDTO: TiendaDTO,
  ) {
    const store: TiendaEntity = plainToInstance(TiendaEntity, storeDTO);
    return await this.tiendaService.update(tiendaId, store);
  }

  @Delete(':tiendaId')
  @HttpCode(204)
  async deleteStore(@Param('tiendaId') tiendaId: string) {
    return await this.tiendaService.delete(tiendaId);
  }
}
