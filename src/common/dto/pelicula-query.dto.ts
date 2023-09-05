import { IsString } from '../validation'

export class PeliculaQueryDto {
  @IsString()
  nombre: string
}
