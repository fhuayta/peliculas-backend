import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto'
import { DataSource } from 'typeorm'
import { CrearParametroDto } from './dto/crear-parametro.dto'
import { Parametro } from './parametro.entity'
import { Injectable } from '@nestjs/common'
import { ActualizarParametroDto } from './dto/actualizar-parametro.dto'

@Injectable()
export class ParametroRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Parametro)
      .createQueryBuilder('parametro')
      .where({ id: id })
      .getOne()
  }

  async actualizar(
    id: string,
    parametroDto: ActualizarParametroDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar: QueryDeepPartialEntity<Parametro> = new Parametro({
      ...parametroDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Parametro)
      .update(id, datosActualizar)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Parametro)
      .createQueryBuilder('parametro')
      .select([
        'parametro.id',
        'parametro.codigo',
        'parametro.nombre',
        'parametro.grupo',
        'parametro.descripcion',
        'parametro.estado',
      ])
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        '(parametro.codigo like :filtro or parametro.nombre ilike :filtro or parametro.descripcion ilike :filtro or parametro.grupo ilike :filtro)',
        { filtro: `%${filtro}%` }
      )
    }
    return await query.getManyAndCount()
  }

  async listarPorGrupo(grupo: string) {
    return await this.dataSource
      .getRepository(Parametro)
      .createQueryBuilder('parametro')
      .select(['parametro.id', 'parametro.codigo', 'parametro.nombre'])
      .where('parametro.grupo = :grupo', {
        grupo,
      })
      .getMany()
  }

  async buscarCodigo(codigo: string) {
    return this.dataSource
      .getRepository(Parametro)
      .findOne({ where: { codigo: codigo } })
  }

  async crear(parametroDto: CrearParametroDto, usuarioAuditoria: string) {
    const { codigo, nombre, grupo, descripcion } = parametroDto

    const parametro = new Parametro()
    parametro.codigo = codigo
    parametro.nombre = nombre
    parametro.grupo = grupo
    parametro.descripcion = descripcion
    parametro.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Parametro).save(parametro)
  }
}
