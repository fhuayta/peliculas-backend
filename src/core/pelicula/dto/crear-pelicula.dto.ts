import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { IsString } from 'src/common/validation'

export class CrearPeliculaDto {
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

  @IsString()
  poster: string

  @IsString()
  title: string

  @IsString()
  year: string

  @IsString()
  director: string

  @IsString()
  actors: string
}
