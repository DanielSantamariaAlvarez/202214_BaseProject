import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

import { TiendaService } from './tienda.service';
import { TiendaController } from './tienda.controller';

jest.mock('./tienda.service');
describe('TiendaController', () => {
  let controller: TiendaController;
  let spyService: TiendaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [TiendaController],
      providers: [TiendaService],
    }).compile();

    controller = module.get<TiendaController>(TiendaController);
    spyService = module.get<TiendaService>(TiendaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling findAllStores method', () => {
    controller.findAllStores();
    expect(spyService.findAll).toHaveBeenCalled();
  });

  it('calling findOneStore method', () => {
    controller.findOneStore('1');
    expect(spyService.findOne).toHaveBeenCalled();
  });

  it('calling createStore method', () => {
    const tiendaBorrador = {
      id: faker.random.alphaNumeric(),
      nombre: faker.company.name(),
      ciudad: faker.datatype.string(3),
      direccion: faker.address.direction(),
      productos: [],
    };
    controller.createStore(tiendaBorrador);
    expect(spyService.create).toHaveBeenCalled();
  });

  it('calling updateStore method', () => {
    const storeId = faker.random.alphaNumeric();
    const tiendaBorrador = {
      id: faker.random.alphaNumeric(),
      nombre: faker.company.name(),
      ciudad: faker.datatype.string(3),
      direccion: faker.address.direction(),
      productos: [],
    };
    controller.updateStore(storeId, tiendaBorrador);
    expect(spyService.update).toHaveBeenCalled();
  });

  it('calling deleteStore method', () => {
    controller.deleteStore('1');
    expect(spyService.delete).toHaveBeenCalled();
  });
});
