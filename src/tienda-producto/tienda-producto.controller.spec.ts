import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { TiendaProductoController } from './tienda-producto.controller';

import { TiendaProductoService } from './tienda-producto.service';

jest.mock('./tienda-producto.service');

describe('TiendaProductoController', () => {
  let controller: TiendaProductoController;
  let spyService: TiendaProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [TiendaProductoController],
      providers: [TiendaProductoService],
    }).compile();

    controller = module.get<TiendaProductoController>(TiendaProductoController);
    spyService = module.get<TiendaProductoService>(TiendaProductoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling addStoreToProduct method', () => {
    controller.addStoreToProduct('1', '1');
    expect(spyService.addStoreToProducto).toHaveBeenCalled();
  });

  it('calling findAllStoresByProduct method', () => {
    controller.findAllStoresByProduct('1');
    expect(spyService.findStoresFromProducto).toHaveBeenCalled();
  });

  it('calling findOneStoreByProduct method', () => {
    controller.findOneStoreByProduct('1', '1');
    expect(spyService.findStoreFromProducto).toHaveBeenCalled();
  });

  it('calling updateStoresByProduct method', () => {
    const tiendaBorrador = {
      id: faker.random.alphaNumeric(),
      nombre: faker.company.name(),
      ciudad: faker.datatype.string(3),
      direccion: faker.address.direction(),
    };
    controller.updateStoresByProduct('1', [tiendaBorrador]);
    expect(spyService.updateStoresFromProducto).toHaveBeenCalled();
  });

  it('calling deleteStoreByProduct method', () => {
    controller.deleteStoreByProduct('1', '1');
    expect(spyService.deleteStoreFromProducto).toHaveBeenCalled();
  });
});
