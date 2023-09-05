import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { BaseController } from 'src/common/base/base-controller'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'
import { PeliculaService } from '../service/pelicula.service'
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  StatusDescripcionEnum,
  StatusValorEnum,
} from 'src/common/enum/status-valor'
import { PeliculaQueryDto } from 'src/common/dto/pelicula-query.dto'
import { PeliculaDetalleQueryDto } from 'src/common/dto/pelicula-detalle-query.dto copy'
import { CrearPeliculaDto } from '../dto/crear-pelicula.dto'

@ApiTags('pelicula')
// @ApiBearerAuth('defaultBearerAuth')
@ApiResponse({
  status: StatusValorEnum.STATUS_401,
  description: StatusDescripcionEnum.USUARIO_NO_AUTORIZADO,
})
// @ApiResponse({
//   status: StatusValorEnum.STATUS_412,
//   description: StatusDescripcionEnum.ERROR_PRECONDICION,
// })
// @UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('pelicula')
export class PeliculaController extends BaseController {
  constructor(private peliculaService: PeliculaService) {
    super(PeliculaController.name)
  }

  // @ApiExcludeEndpoint()
  // @ApiOperation({ summary: 'Obtener todas las api-clave' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @ApiResponse({
    status: StatusValorEnum.STATUS_200,
    description: StatusDescripcionEnum.RETORNA_LISTA_REGISTRO,
  })
  @Get('todos')
  async listarTodos(@Query() paginacionQueryDto: PaginacionQueryDto) {
    console.log('--log--LISTAR TODOS === ', paginacionQueryDto)
    const result = await this.peliculaService.listarTodos(paginacionQueryDto)
    return this.successListRows(result)
  }

  // @ApiExcludeEndpoint()
  // @UseGuards(JwtAuthGuard, CasbinGuard)
  @ApiOperation({ summary: 'Api pública peliculas' })
  @ApiResponse({
    status: StatusValorEnum.STATUS_200,
    description: StatusDescripcionEnum.CREAR_EXITO,
  })
  @Get('lista')
  async lista(@Req() req, @Query() query: PeliculaQueryDto) {
    //const usuarioAuditoria = this.getUser(req)
    console.log('--log--PARAMETROS = ', query)
    const nombreBusqueda = query.nombre || ''
    const paginacion = new PaginacionQueryDto()
    const pelis = await this.peliculaService.listarPeliculas(
      paginacion,
      nombreBusqueda
    )
    console.log('--log--OBJETO: ', pelis)
    return this.successListRowsIterable(pelis)
    // return pelis
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @ApiOperation({ summary: 'Crear pelicula' })
  @ApiResponse({
    status: StatusValorEnum.STATUS_201,
    description: StatusDescripcionEnum.CREAR_EXITO,
  })
  @Post()
  async crear(@Req() req, @Body() rolDto: CrearPeliculaDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.peliculaService.crear(rolDto, usuarioAuditoria)
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'Api pública detalles' })
  @ApiResponse({
    status: StatusValorEnum.STATUS_200,
    description: StatusDescripcionEnum.CREAR_EXITO,
  })
  @Get('/:id')
  async detalle(@Req() req, @Param() params: any) {
    //const usuarioAuditoria = this.getUser(req)
    console.log('--log--PARAMETROS XXXXX = ', params)
    const pelis = await this.peliculaService.detallePelicula(params.id)
    console.log('--log--OBJETO: ', pelis)
    return this.success(pelis)
  }

  //fixme: Datos sensibles no  deberian ser accedidos
  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idPlan } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.peliculaService.inactivar(
      idPlan,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  //fixme: Datos sensibles no  deberian ser accedidos
  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/eliminacion')
  async eliminar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idParametro } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.peliculaService.eliminar(
      idParametro,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
