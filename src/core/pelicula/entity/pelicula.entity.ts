import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Status } from '../../../common/constants'
import { Usuario } from 'src/core/usuario/entity/usuario.entity'

dotenv.config()

export const SuscripcionEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
  DELETE: Status.ELIMINATE,
}

@Check(UtilService.buildStatusCheck(SuscripcionEstado))
@Entity({ name: 'pelicula', schema: process.env.DB_SCHEMA_USUARIOS })
export class Pelicula extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({
    name: 'fecha_generacion',
    type: 'date',
    nullable: false,
  })
  fechaGeneracion?: Date | null

  @Column({ name: 'poster', length: 2000, type: 'varchar' })
  poster: string

  @Column({
    name: 'title',
    length: 500,
    type: 'varchar',
  })
  title: string

  @Column({
    name: 'year',
    type: 'varchar',
  })
  year: string

  @Column({
    name: 'director',
    length: 500,
    type: 'varchar',
  })
  director: string

  @Column({
    name: 'actors',
    length: 1500,
    type: 'varchar',
  })
  actors: string

  @ManyToOne(() => Usuario, (usuario) => usuario.peliculas)
  @JoinColumn({
    name: 'id_usuario',
    referencedColumnName: 'id',
  })
  usuario: Usuario

  constructor(data?: Partial<Pelicula>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || SuscripcionEstado.ACTIVE
  }
}
