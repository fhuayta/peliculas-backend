import { TextService } from '../../../common/lib/text.service'
import { DataSource, EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { CrearClaveApiDto } from '../dto/crear-pelicula.dto'
import { Pelicula } from '../entity/pelicula.entity'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { EstadoClaveApiEnum } from '../enum/estado-clave-api.enum'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { Status } from 'src/common/constants'
import { Usuario } from 'src/core/usuario/entity/usuario.entity'

@Injectable()
export class PeliculaRepository {
  constructor(private dataSource: DataSource) {}

  async crear(claveApiDto: CrearClaveApiDto, usuarioAuditoria: string) {
    const nuevoUsuario = new Usuario()
    nuevoUsuario.id = claveApiDto.usuario

    const claveApi = new Pelicula()
    claveApi.fechaGeneracion = new Date()
    claveApi.usuario = nuevoUsuario
    claveApi.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Pelicula).save(claveApi)
  }

  async listarTodos(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro } = paginacionQueryDto
    const query = await this.dataSource
      .getRepository(Pelicula)
      .createQueryBuilder('claveApi')
      .select([
        'claveApi.id',
        'claveApi.estado',
        'claveApi.fechaGeneracion',
        'claveApi.fechaCaducidad',
        'claveApi.etiqueta',
        'claveApi.clave',
      ])
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        '(claveApi.etiqueta ilike :filtro or claveApi.estado ilike :filtro)',
        {
          filtro: `%${filtro}%`,
        }
      )
    }
    return await query.getManyAndCount()
  }

  async buscarPorId(id: string, transaction?: EntityManager) {
    return await (
      transaction?.getRepository(Pelicula) ??
      this.dataSource.getRepository(Pelicula)
    )
      .createQueryBuilder('claveApi')
      .where({ id: id })
      .getOne()
  }

  async actualizar(
    id: string,
    parametroDto: Partial<Pelicula>,
    usuarioAuditoria: string
  ) {
    const datosActualizar: QueryDeepPartialEntity<Pelicula> = new Pelicula({
      ...parametroDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Pelicula)
      .update(id, datosActualizar)
  }
}
