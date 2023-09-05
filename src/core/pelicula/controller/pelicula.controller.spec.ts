import { Test, TestingModule } from '@nestjs/testing'
import { ClaveApiController } from './pelicula.controller'

describe('SuscripcionController', () => {
  let controller: ClaveApiController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaveApiController],
    }).compile()

    controller = module.get<ClaveApiController>(ClaveApiController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
