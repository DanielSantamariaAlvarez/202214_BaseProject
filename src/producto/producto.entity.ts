import { TiendaEntity } from '../tienda/tienda.entity';
import { Column, Entity, ManyToOne, JoinTable, ManyToMany, PrimaryGeneratedColumn  } from 'typeorm';
import { TipoProducto } from './tipoProducto.enum';

@Entity()
export class ProductoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;
    
    @Column()
    precio: number;
    
    @Column()
    tipo: TipoProducto;
    
    @ManyToMany(() => TiendaEntity, tienda => tienda.productos)
    tiendas: TiendaEntity[];
}
