import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { IsString } from 'src/common/validation'

export class CrearClaveApiDto {
  @ApiProperty({
    example: 'sistema abc',
    description: 'La etiqueta de la clave api',
  })
  @IsString()
  etiqueta: string

  @ApiHideProperty()
  fechaCaducidad?: string

  @ApiHideProperty()
  usuario: string
}
