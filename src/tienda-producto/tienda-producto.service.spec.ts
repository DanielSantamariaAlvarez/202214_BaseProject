import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { TiendaEntity } from '../tienda/tienda.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaDTO } from '../tienda/tienda.dto';
import { TiendaProductoService } from './tienda-producto.service';
import { TipoProducto } from '../producto/tipoProducto.enum';

describe('TiendaProductoService', () => {
  let service: TiendaProductoService;
  let tiendaRepository: Repository<TiendaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let producto: ProductoEntity;
  let listaTiendas: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaProductoService],
    }).compile();

    service = module.get<TiendaProductoService>(TiendaProductoService);
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();
    listaTiendas = [];

    for (let i = 0; i < 5; i++) {
      const store = new TiendaEntity();
      store.nombre = faker.company.name();
      store.ciudad = faker.datatype.string(3);
      store.direccion = faker.address.direction();
      await tiendaRepository.save(store);
      listaTiendas.push(store);
    }

    producto = await productoRepository.save({
      nombre: faker.word.adjective(),
      precio: faker.datatype.number(),
      tipo: TipoProducto.NO_PERECEDERO,
      tiendas: listaTiendas,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add an store to a product', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.datatype.string(3),
      direccion: faker.address.direction(),
    });

    const newProduct: ProductoEntity = await productoRepository.save({
      nombre: faker.word.adjective(),
      precio: faker.datatype.number(),
      tipo: TipoProducto.PERECEDERO,
    });

    const result: ProductoEntity = await service.addStoreToProducto(
      newProduct.id,
      newTienda.id,
    );

    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(result.tiendas[0].ciudad).toBe(newTienda.ciudad);
  });

  it('addStoreToProduct should thrown exception for an invalid store', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.word.adjective(),
      precio: faker.datatype.number(),
      tipo: TipoProducto.PERECEDERO,
    });

    await expect(() =>
      service.addStoreToProducto(newProducto.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('addStoreToProduct should throw an exception for an invalid product', async () => {
    const tiendaNueva: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.datatype.string(3),
      direccion: faker.address.direction(),
    });

    await expect(() =>
      service.addStoreToProducto('0', tiendaNueva.id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('findStoresFromProduct should return tiendas by product', async () => {
    const tiendas: TiendaDTO[] = await service.findStoresFromProducto(producto.id);
    expect(tiendas.length).toBe(5);
  });

  it('findStoresFromProduct should throw an exception for an invalid product', async () => {
    await expect(() =>
      service.findStoresFromProducto('0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('findStoreFromProduct should return store by product', async () => {
    const tienda: TiendaEntity = listaTiendas[0];
    const tiendaBorrador: TiendaDTO = await service.findStoreFromProducto(
      producto.id,
      tienda.id,
    );
    expect(tiendaBorrador).not.toBeNull();
    expect(tiendaBorrador.nombre).toBe(tienda.nombre);
    expect(tiendaBorrador.ciudad).toBe(tienda.ciudad);
    expect(tiendaBorrador.direccion).toBe(tienda.direccion);
  });

  it('findStoreFromProduct should throw an exception for an invalid store', async () => {
    await expect(() =>
      service.findStoreFromProducto(producto.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('findStoreFromProduct should throw an exception for an invalid product', async () => {
    const store: TiendaEntity = listaTiendas[0];
    await expect(() =>
      service.findStoreFromProducto('0', store.id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('findStoreFromProduct should throw an exception for an store not associated to the product', async () => {
    const tiendaNueva: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.datatype.string(3),
      direccion: faker.address.direction(),
    });

    await expect(() =>
      service.findStoreFromProducto(producto.id, tiendaNueva.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id is not associated to the product',
    );
  });

  it('updateStoresFromProduct should update tiendas list for a product', async () => {
    const tiendaNueva: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.datatype.string(3),
      direccion: faker.address.direction(),
    });

    const updateProduct: ProductoEntity = await service.updateStoresFromProducto(
      producto.id,
      [tiendaNueva],
    );
    expect(updateProduct.tiendas.length).toBe(1);

    expect(updateProduct.tiendas[0].nombre).toBe(tiendaNueva.nombre);
    expect(updateProduct.tiendas[0].ciudad).toBe(tiendaNueva.ciudad);
  });

  it('updateStoresFromProduct should throw an exception for an invalid product', async () => {
    const tiendaNueva: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.datatype.string(3),
      direccion: faker.address.direction(),
    });

    await expect(() =>
      service.updateStoresFromProducto('0', [tiendaNueva]),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('updateStoresFromProduct should throw an exception for an invalid store', async () => {
    const tiendaNueva: TiendaEntity = listaTiendas[0];
    tiendaNueva.id = '0';

    await expect(() =>
      service.updateStoresFromProducto(producto.id, [tiendaNueva]),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should remove an store from a product', async () => {
    const store: TiendaEntity = listaTiendas[0];

    await service.deleteStoreFromProducto(producto.id, store.id);

    const mockProduct: ProductoEntity = await productoRepository.findOne({
      where: { id: producto.id },
      relations: ['tiendas'],
    });
    const deletedStore: TiendaEntity = mockProduct.tiendas.find(
      (a) => a.id === store.id,
    );

    expect(deletedStore).toBeUndefined();
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid store', async () => {
    await expect(() =>
      service.deleteStoreFromProducto(producto.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid museum', async () => {
    const tienda: TiendaEntity = listaTiendas[0];
    await expect(() =>
      service.deleteStoreFromProducto('0', tienda.id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an non asocciated store', async () => {
    const tiendaNueva: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.datatype.string(3),
      direccion: faker.address.direction(),
    });

    await expect(() =>
      service.deleteStoreFromProducto(producto.id, tiendaNueva.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id is not associated to the product',
    );
  });
});
