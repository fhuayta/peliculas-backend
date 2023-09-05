import { Inject, Injectable, PreconditionFailedException } from '@nestjs/common'
import { BaseService } from 'src/common/base/base-service'
import { Status } from 'src/common/constants'
import { Messages } from 'src/common/constants/response-messages'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { CrearClaveApiDto } from '../dto/crear-pelicula.dto'
import { PeliculaRepository } from '../repository/pelicula.repository'
import axios from 'axios'

@Injectable()
export class PeliculaService extends BaseService {
  constructor(
    @Inject(PeliculaRepository)
    private peliculaRepositorio: PeliculaRepository,
  ) {
    super(PeliculaService.name)
  }

  private readonly omdbApiUrl =
    process.env.PELICULAS_URL || 'https://www.omdbapi.com/'
  private readonly apiKey = process.env.PELICULAS_TOKEN || '827b8f37'

  async listarPeliculas(paginacionQueryDto: PaginacionQueryDto, nombre) {
    console.log('--log--RESPUESTA SERVICE ^^-------------')
    try {
      const response = await axios.get(this.omdbApiUrl, {
        params: {
          apikey: this.apiKey,
          s: nombre,
        },
      });
      console.log('--log--DATA: ', response.data)
      if (
        response.data['Response'] === 'False' ||
        response.data['Response'] === 'false' ||
        response.data['Response'] === 'FALSE'
      ) {
        return {
          filas: [],
          total: 0,
        }
      } else {
        return {
          filas: response.data['Search'],
          total: response.data.totalResults,
        }
      }
    } catch (error) {
      // Aquí puedes manejar errores, como lanzar una excepción personalizada.
      throw new Error('No se pudo realizar la búsqueda en OMDB.');
    }
  }

  async detallePelicula(id: string) {
    try {
      const response = await axios.get(this.omdbApiUrl, {
        params: {
          apikey: this.apiKey,
          i: id,
        },
      });
      console.log('--log--DATA DET ======= : ', response.data)
      if (
        response.data['Response'] === 'False' ||
        response.data['Response'] === 'false' ||
        response.data['Response'] === 'FALSE'
      ) {
        return {}
      } else {
        return response.data
      }
    } catch (error) {
      // Aquí puedes manejar errores, como lanzar una excepción personalizada.
      throw new Error('No se pudo realizar la búsqueda en OMDB.');
    }
  }

  // async crear(claveDto: CrearClaveApiDto, usuarioAuditoria: string) {
  //   const suscripcion = await this.suscripcionService.validarCuotaDisponible(
  //     usuarioAuditoria
  //   )
  //   if (suscripcion.cantidadCorreo === null) {
  //     throw new PreconditionFailedException(
  //       Messages.ERROR_SUSCRIPCIONES_ACTIVAS
  //     )
  //   }

  //   console.log('clave*******' + JSON.stringify(suscripcion))
  //   const totalC = suscripcion.cantidadCorreo - suscripcion.cantidadCorreoUsado
  //   const totalS = suscripcion.cantidadSms - suscripcion.cantidadSmsUsado
  //   const totalW =
  //     suscripcion.cantidadWhatsapp - suscripcion.cantidadWhatsappUsado
  //   if (totalC <= 0 && totalS <= 0 && totalW <= 0) {
  //     throw new PreconditionFailedException(
  //       Messages.ERROR_SUSCRIPCIONES_ACTIVAS_CUOTAS
  //     )
  //   }
  //   return await this.peliculaRepositorio.crear(claveDto, usuarioAuditoria)
  // }

  async listarTodos(paginacionQueryDto: PaginacionQueryDto) {
    return await this.peliculaRepositorio.listarTodos(paginacionQueryDto)
  }

  async activar(idParametro: string, usuarioAuditoria: string) {
    const clave = await this.peliculaRepositorio.buscarPorId(idParametro)
    if (!clave) {
      throw new PreconditionFailedException(Messages.EXCEPTION_DEFAULT)
    }
    await this.peliculaRepositorio.actualizar(
      idParametro,
      { estado: Status.ACTIVE },
      usuarioAuditoria
    )
    return {
      id: idParametro,
      estado: Status.ACTIVE,
    }
  }

  async inactivar(idParametro: string, usuarioAuditoria: string) {
    const clave = await this.peliculaRepositorio.buscarPorId(idParametro)
    if (!clave) {
      throw new PreconditionFailedException(Messages.EXCEPTION_DEFAULT)
    }
    await this.peliculaRepositorio.actualizar(
      idParametro,
      { estado: Status.INACTIVE },
      usuarioAuditoria
    )
    return {
      id: idParametro,
      estado: Status.INACTIVE,
    }
  }

  async eliminar(idClave: string, usuarioAuditoria: string) {
    const parametro = await this.peliculaRepositorio.buscarPorId(idClave)
    if (!parametro) {
      throw new PreconditionFailedException(Messages.EXCEPTION_DEFAULT)
    }
    await this.peliculaRepositorio.actualizar(
      idClave,
      { estado: Status.ELIMINATE },
      usuarioAuditoria
    )
    return {
      id: idClave,
      estado: Status.ELIMINATE,
    }
  }
}
