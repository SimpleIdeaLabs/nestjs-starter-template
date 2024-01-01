import { Controller, Get } from '@nestjs/common';
import { searchProvince } from 'ph-geo-admin-divisions';
@Controller({
  path: 'ph-data',
  version: '1',
})
export class PhDataController {
  @Get('/provinces')
  async getProvince() {
    const provinces = await searchProvince({
      name: 'bu',
    });
    return provinces;
  }
}
