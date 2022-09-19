import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ProductoDTO } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { TipoProducto } from './tipoProducto.enum';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly repositoryProducto: Repository<ProductoEntity>,
  ) {}

  async findAll(): Promise<ProductoDTO[]> {
    return await this.repositoryProducto.find({ loadRelationIds: true });
  }

  async findOne(id: string): Promise<ProductoDTO> {
    const product = await this.repositoryProducto.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return product;
  }

  async create(productoDTO: ProductoDTO): Promise<ProductoDTO> {
    if (!(productoDTO.tipo in TipoProducto)) {
      throw new BusinessLogicException(
        'The type product is invalid. Please use PERECEDERO or NO_PERECEDERO value',
        BusinessError.BAD_REQUEST,
      );
    }
    const producto = new ProductoEntity();
    producto.nombre = productoDTO.nombre;
    producto.precio = productoDTO.precio;
    producto.tipo = productoDTO.tipo;
    return await this.repositoryProducto.save(producto);
  }

  async update(id: string, productoDTO: ProductoDTO): Promise<ProductoDTO> {
    const producto = await this.repositoryProducto.findOne({ where: { id } });
    if (!producto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (!(productoDTO.tipo in TipoProducto)) {
      throw new BusinessLogicException(
        'The type product is invalid. Please use PERECEDERO or NO_PERECEDERO value',
        BusinessError.BAD_REQUEST,
      );
    }
    producto.nombre = productoDTO.nombre;
    producto.precio = productoDTO.precio;
    producto.tipo = productoDTO.tipo;
    await this.repositoryProducto.save(producto);
    return producto;
  }

  async delete(id: string) {
    const producto = await this.repositoryProducto.findOne({ where: { id } });
    if (!producto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return await this.repositoryProducto.remove(producto);
  }
}
