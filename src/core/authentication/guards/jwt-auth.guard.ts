import { LoggerService } from '../../logger/logger.service'
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  protected logger = LoggerService.getInstance(JwtAuthGuard.name)

  async canActivate(context: ExecutionContext) {
    const {
      user,
      originalUrl,
      query,
      route,
      headers,
      method: action,
    } = context.switchToHttp().getRequest() as Request
    const resource = Object.keys(query).length ? route.path : originalUrl

    try {
      const isPermitted = (await super.canActivate(context)) as boolean
      if (!isPermitted) throw new ForbiddenException()
    } catch (err) {
      const token = headers.authorization
        ? `${headers.authorization.substring(0, 20)}...`
        : String(headers.authorization)

      if (!headers.authorization) {
        const errMsg = `${action} ${resource} -> false - Usuario: ${user?.id} (Se requiere: req.headers.authorization)`
        this.logger.warn(errMsg)
        throw err
      }

      const errMsg = `${action} ${resource} -> false - Usuario: ${user?.id} (Token inválido: ${token})`
      this.logger.warn(errMsg, err)
      throw err
    }

    // this.logger.info(`${action} ${resource} -> true - Usuario: ${user?.id}`)
    return true
  }
}
