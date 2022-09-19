import { IsNumber, IsString } from 'class-validator';
import { TipoProducto } from './tipoProducto.enum';

export class ProductoDTO {
  readonly id: string;

  @IsString()
  readonly nombre: string;

  @IsNumber()
  readonly precio: number;

  readonly tipo: TipoProducto;
}
