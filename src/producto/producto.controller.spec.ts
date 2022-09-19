import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { TipoProducto } from './tipoProducto.enum';

jest.mock('./producto.service');

describe('ProductoController', () => {
  let controller: ProductoController;
  let spyService: ProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [ProductoController],
      providers: [ProductoService],
    }).compile();

    controller = module.get<ProductoController>(ProductoController);
    spyService = module.get<ProductoService>(ProductoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling findAllProducts method', () => {
    controller.findAllProducts();
    expect(spyService.findAll).toHaveBeenCalled();
  });

  it('calling findOneProduct method', () => {
    controller.findOneProduct('1');
    expect(spyService.findOne).toHaveBeenCalled();
  });

  it('calling createProduct method', () => {
    const mockProduct = {
      id: faker.random.alphaNumeric(),
      nombre: faker.company.name(),
      precio: faker.datatype.number(),
      tipo: TipoProducto.NO_PERECEDERO,
      tiendas: [],
    };
    controller.createProduct(mockProduct);
    expect(spyService.create).toHaveBeenCalled();
  });

  it('calling updateProduct method', () => {
    const productId = faker.random.alphaNumeric();
    const mockProduct = {
      id: productId,
      nombre: faker.company.name(),
      precio: faker.datatype.number(),
      tipo: TipoProducto.NO_PERECEDERO,
      tiendas: [],
    };
    controller.updateProduct(productId, mockProduct);
    expect(spyService.update).toHaveBeenCalled();
  });

  it('calling deleteProduct method', () => {
    controller.deleteProduct('1');
    expect(spyService.delete).toHaveBeenCalled();
  });
});
