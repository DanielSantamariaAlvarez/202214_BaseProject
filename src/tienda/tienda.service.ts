import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { TiendaDTO } from './tienda.dto';
import { TiendaEntity } from './tienda.entity';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}

  async findAll(): Promise<TiendaDTO[]> {
    return await this.tiendaRepository.find({ loadRelationIds: true });
  }

  async findOne(id: string): Promise<TiendaDTO> {
    const store = await this.tiendaRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return store;
  }

  async create(tiendaDTO: TiendaDTO): Promise<TiendaDTO> {
    const store = new TiendaEntity();
    if (tiendaDTO.ciudad.length < 3 || tiendaDTO.ciudad.length > 3)
      throw new BusinessLogicException(
        'The ciudad store is invalid',
        BusinessError.BAD_REQUEST,
      );
    store.nombre = tiendaDTO.nombre;
    store.ciudad = tiendaDTO.ciudad;
    store.direccion = tiendaDTO.direccion;
    return await this.tiendaRepository.save(store);
  }

  async update(id: string, tiendaDTO: TiendaDTO): Promise<TiendaDTO> {
    const store = await this.tiendaRepository.findOne({ where: { id } });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    if (tiendaDTO.ciudad.length < 3 || tiendaDTO.ciudad.length > 3)
      throw new BusinessLogicException(
        'The ciudad store is invalid',
        BusinessError.BAD_REQUEST,
      );

    store.nombre = tiendaDTO.nombre;
    store.ciudad = tiendaDTO.ciudad;
    store.direccion = tiendaDTO.direccion;
    await this.tiendaRepository.save(store);
    return store;
  }

  async delete(id: string) {
    const store = await this.tiendaRepository.findOne({ where: { id } });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return await this.tiendaRepository.remove(store);
  }
}
