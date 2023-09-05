import { TextService } from '../../../common/lib/text.service'
import { DataSource, EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { CrearPeliculaDto } from '../dto/crear-pelicula.dto'
import { Pelicula } from '../entity/pelicula.entity'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { EstadoClaveApiEnum } from '../enum/estado-clave-api.enum'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { Status } from 'src/common/constants'
import { Usuario } from 'src/core/usuario/entity/usuario.entity'

@Injectable()
export class PeliculaRepository {
  constructor(private dataSource: DataSource) {}

  async crear(claveApiDto: CrearPeliculaDto, usuarioAuditoria: string) {
    const nuevoUsuario = new Usuario()
    nuevoUsuario.id = claveApiDto.usuario

    const pelicula = new Pelicula()
    pelicula.fechaGeneracion = new Date()
    pelicula.usuario = nuevoUsuario
    pelicula.usuarioCreacion = usuarioAuditoria
    pelicula.poster = claveApiDto.poster
    pelicula.title = claveApiDto.title
    pelicula.year = claveApiDto.year
    pelicula.director = claveApiDto.director
    pelicula.actors = claveApiDto.actors

    return await this.dataSource.getRepository(Pelicula).save(pelicula)
  }

  async listarTodos(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro } = paginacionQueryDto
    const query = await this.dataSource
      .getRepository(Pelicula)
      .createQueryBuilder('pelicula')
      .select([
        'pelicula.id',
        'pelicula.estado',
        'pelicula.fechaGeneracion',
        'pelicula.poster',
        'pelicula.title',
        'pelicula.year',
        'pelicula.director',
        'pelicula.actors',
      ])
      .take(limite)
      .skip(saltar)

    // if (filtro) {
    //   query.andWhere(
    //     '(claveApi.etiqueta ilike :filtro or claveApi.estado ilike :filtro)',
    //     {
    //       filtro: `%${filtro}%`,
    //     }
    //   )
    // }
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
