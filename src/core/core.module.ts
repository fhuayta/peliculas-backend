import { Module } from '@nestjs/common'
import { AuthenticationModule } from './authentication/authentication.module'
import { AuthorizationModule } from './authorization/authorization.module'
import { ConfigCoreModule } from './config/config.module'
import { ExternalServicesModule } from './external-services/external.module'
import { ClaveApiModule } from './pelicula/clave-api.module'

@Module({
  imports: [
    ConfigCoreModule,
    ExternalServicesModule,
    AuthorizationModule,
    AuthenticationModule,
    ClaveApiModule,
  ],
  exports: [ExternalServicesModule],
})
export class CoreModule {}
