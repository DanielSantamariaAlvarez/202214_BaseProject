import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ProductoEntity } from './producto.entity';
import { ProductoDTO } from './producto.dto';
import { ProductoService } from './producto.service';
import { TipoProducto } from './tipoProducto.enum';

describe('ProductoService', () => {
  let service: ProductoService;
  let repositoryProducto: Repository<ProductoEntity>;
  let listaProductos: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repositoryProducto = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repositoryProducto.clear();
    listaProductos = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repositoryProducto.save({
        nombre: faker.company.name(),
        precio: faker.datatype.number(),
        tipo: TipoProducto.NO_PERECEDERO,
      });
      listaProductos.push(producto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const productos: ProductoDTO[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(listaProductos.length);
  });

  it('findOne should return a product by id', async () => {
    const mockProduct: ProductoDTO = listaProductos[0];
    const product: ProductoDTO = await service.findOne(mockProduct.id);
    expect(product).not.toBeNull();

    expect(product.nombre).toEqual(mockProduct.nombre);
    expect(product.precio).toEqual(mockProduct.precio);
    expect(product.tipo).toEqual(mockProduct.tipo);
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('create should return a new product', async () => {
    const product: ProductoEntity = {
      id: '',
      nombre: faker.company.name(),
      precio: faker.datatype.number(),
      tipo: TipoProducto.PERECEDERO,
      tiendas: [],
    };

    const newProduct: ProductoDTO = await service.create(product);
    expect(newProduct).not.toBeNull();

    const mockProduct: ProductoDTO = await repositoryProducto.findOne({
      where: { id: newProduct.id },
    });
    expect(mockProduct).not.toBeNull();
    expect(mockProduct.nombre).toEqual(newProduct.nombre);
    expect(mockProduct.precio).toEqual(newProduct.precio);
    expect(mockProduct.tipo).toEqual(newProduct.tipo);
  });

  it('create should return error bad request for a new product', async () => {
    const product: ProductoEntity = {
      id: '',
      nombre: faker.company.name(),
      precio: faker.datatype.number(),
      tipo: null,
      tiendas: [],
    };

    await expect(() => service.create(product)).rejects.toHaveProperty(
      'message',
      'The type product is invalid. Please use PERECEDERO or NO_PERECEDERO value',
    );
  });

  it('update should modify a product', async () => {
    const product: ProductoEntity = listaProductos[0];
    product.nombre = 'New product';
    product.precio = 150;
    product.tipo = TipoProducto.NO_PERECEDERO;
    const updatedProduct: ProductoDTO = await service.update(
      product.id,
      product,
    );
    expect(updatedProduct).not.toBeNull();
    const mockProduct: ProductoEntity = await repositoryProducto.findOne({
      where: { id: product.id },
    });
    expect(mockProduct).not.toBeNull();
    expect(mockProduct.nombre).toEqual(product.nombre);
    expect(mockProduct.precio).toEqual(product.precio);
    expect(mockProduct.tipo).toEqual(product.tipo);
  });

  it('update should throw an exception for an invalid product', async () => {
    let product: ProductoEntity = listaProductos[0];
    product = {
      ...product,
      nombre: 'New product',
      precio: 500,
      tipo: TipoProducto.PERECEDERO,
    };
    await expect(() => service.update('0', product)).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('update should return error bad request for a product', async () => {
    let product: ProductoEntity = listaProductos[0];
    product = {
      ...product,
      nombre: 'New product',
      precio: 500,
      tipo: null,
    };

    await expect(() =>
      service.update(product.id, product),
    ).rejects.toHaveProperty(
      'message',
      'The type product is invalid. Please use PERECEDERO or NO_PERECEDERO value',
    );
  });

  it('delete should remove a product', async () => {
    const product: ProductoEntity = listaProductos[0];
    await service.delete(product.id);
    const deletedProduct: ProductoEntity = await repositoryProducto.findOne({
      where: { id: product.id },
    });
    expect(deletedProduct).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    const product: ProductoEntity = listaProductos[0];
    await service.delete(product.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });
});