import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthorizationModule } from '../authorization/authorization.module'
import { IopModule } from '../external-services/iop/iop.module'
import { MensajeriaModule } from '../external-services/mensajeria/mensajeria.module'
import { PeliculaController } from './controller/pelicula.controller'
import { Pelicula } from './entity/pelicula.entity'
import { PeliculaRepository } from './repository/pelicula.repository'
import { PeliculaService } from './service/pelicula.service'

@Module({
  providers: [PeliculaService, PeliculaRepository],
  imports: [
    TypeOrmModule.forFeature([Pelicula]),
    MensajeriaModule,
    IopModule,
    ConfigModule,
    AuthorizationModule,
  ],
  controllers: [PeliculaController],
  exports: [PeliculaService],
})
export class ClaveApiModule {}
