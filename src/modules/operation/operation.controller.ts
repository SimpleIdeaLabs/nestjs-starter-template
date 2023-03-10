import { Controller, Get } from '@nestjs/common';

@Controller('operation')
export class OperationController {
  @Get('/health')
  async checkHealth() {
    return {
      healthy: true,
    };
  }
}
