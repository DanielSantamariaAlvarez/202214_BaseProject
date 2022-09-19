import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TiendaEntity } from './tienda.entity';
import { TiendaDTO } from './tienda.dto';
import { TiendaService } from './tienda.service';

describe('TiendaService', () => {
  let service: TiendaService;
  let tiendaRepository: Repository<TiendaEntity>;
  let listaTiendas: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    listaTiendas = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.datatype.string(3),
        direccion: faker.address.direction(),
      });
      listaTiendas.push(tienda);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all tiendas', async () => {
    const tiendas: TiendaDTO[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(listaTiendas.length);
  });

  it('findOne should return a tienda by id', async () => {
    const tiendaBorrador: TiendaDTO = listaTiendas[0];
    const tienda: TiendaDTO = await service.findOne(tiendaBorrador.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(tiendaBorrador.nombre);
    expect(tienda.ciudad).toEqual(tiendaBorrador.ciudad);
    expect(tienda.direccion).toEqual(tiendaBorrador.direccion);
  });

  it('findOne should throw an exception for an invalid tienda', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('create should return a new tienda', async () => {
    const tienda: TiendaEntity = {
      id: '',
      nombre: 'Tiendita esquinera',
      ciudad: faker.datatype.string(3),
      direccion: faker.address.direction(),
      productos: [],
    };

    const newStore: TiendaDTO = await service.create(tienda);
    expect(newStore).not.toBeNull();

    const tiendaBorrador: TiendaDTO = await tiendaRepository.findOne({
      where: { id: newStore.id },
    });
    expect(tiendaBorrador).not.toBeNull();
    expect(tiendaBorrador.nombre).toEqual(newStore.nombre);
    expect(tiendaBorrador.ciudad).toEqual(newStore.ciudad);
    expect(tiendaBorrador.direccion).toEqual(newStore.direccion);
  });

  it('create should return a location tienda is invalid', async () => {
    const tienda: TiendaEntity = {
      id: '',
      nombre: faker.company.name(),
      ciudad: faker.datatype.string(4),
      direccion: faker.address.direction(),
      productos: [],
    };

    await expect(() => service.create(tienda)).rejects.toHaveProperty(
      'message',
      'The ciudad store is invalid',
    );
  });

  it('update should modify a tienda', async () => {
    const tienda: TiendaEntity = listaTiendas[0];
    tienda.nombre = 'Bon ice';
    tienda.ciudad = 'BOG';
    tienda.direccion = 'Calle 12d bis #1-17';
    const updatedStore: TiendaDTO = await service.update(tienda.id, tienda);
    expect(updatedStore).not.toBeNull();
    const tiendaBorrador: TiendaEntity = await tiendaRepository.findOne({
      where: { id: tienda.id },
    });
    expect(tiendaBorrador).not.toBeNull();
    expect(tiendaBorrador.nombre).toEqual(tienda.nombre);
    expect(tiendaBorrador.ciudad).toEqual(tienda.ciudad);
    expect(tiendaBorrador.direccion).toEqual(tienda.direccion);
  });

  it('update should return a location tienda is invalid', async () => {
    let tienda: TiendaEntity = listaTiendas[0];
    tienda = {
      ...tienda,
      nombre: faker.company.name(),
      ciudad: faker.datatype.string(4),
      direccion: faker.address.direction(),
    };

    await expect(() => service.update(tienda.id, tienda)).rejects.toHaveProperty(
      'message',
      'The ciudad store is invalid',
    );
  });

  it('update should throw an exception for an invalid tienda', async () => {
    let tienda: TiendaEntity = listaTiendas[0];
    tienda = {
      ...tienda,
      nombre: 'producto2',
      ciudad: 'CAL',
      direccion: 'Carrera 33a #15-49',
    };
    await expect(() => service.update('0', tienda)).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('delete should remove a tienda', async () => {
    const tienda: TiendaEntity = listaTiendas[0];
    await service.delete(tienda.id);
    const deletedStore: TiendaEntity = await tiendaRepository.findOne({
      where: { id: tienda.id },
    });
    expect(deletedStore).toBeNull();
  });

  it('delete should throw an exception for an invalid tienda', async () => {
    const tienda: TiendaEntity = listaTiendas[0];
    await service.delete(tienda.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });
});
