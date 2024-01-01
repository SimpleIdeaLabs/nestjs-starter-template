import { Test, TestingModule } from '@nestjs/testing';
import { PhDataController } from './ph-data.controller';

describe('PhDataController', () => {
  let controller: PhDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhDataController],
    }).compile();

    controller = module.get<PhDataController>(PhDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
