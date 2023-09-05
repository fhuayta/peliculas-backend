import { Test, TestingModule } from '@nestjs/testing'
import { ClaveApiService } from './pelicula.service'

describe('ServiceService', () => {
  let service: ClaveApiService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClaveApiService],
    }).compile()

    service = module.get<ClaveApiService>(ClaveApiService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
