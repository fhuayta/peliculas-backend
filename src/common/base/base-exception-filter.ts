import { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { LoggerService } from '../../core/logger/logger.service'

export class BaseExceptionFilter implements ExceptionFilter {
  protected logger: LoggerService

  constructor(context: string) {
    this.logger = LoggerService.getInstance(context)
  }

  catch(exception: unknown, host: ArgumentsHost) {
    throw new Error(
      `Method not implemented. exception = ${exception} host = ${host}`
    )
  }
}
