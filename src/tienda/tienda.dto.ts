import { IsString } from 'class-validator';

export class TiendaDTO {
  readonly id: string;

  @IsString()
  readonly nombre: string;

  @IsString()
  readonly ciudad: string;

  @IsString()
  readonly direccion: string;
}
