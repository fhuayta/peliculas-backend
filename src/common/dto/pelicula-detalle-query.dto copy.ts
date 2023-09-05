import { IsString } from '../validation'

export class PeliculaDetalleQueryDto {
  @IsString()
  id: string
}
