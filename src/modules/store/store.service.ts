import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiResponse } from '../../common/dtos/api-response';
import {
  ReadStoreResponse,
  UpdateStoreParams,
  UpdateStoreResponse,
} from './store.dto';
import { DataSource } from 'typeorm';
import { Store } from './store.entity';
import { plainToClass } from 'class-transformer';
import { validateAndExtract } from 'class-validator-ext';
import { ERROR_TITLES } from '../../common/constants/constants';
import {
  searchBaranggay,
  searchMunicipality,
  searchProvince,
} from 'ph-geo-admin-divisions';

@Injectable()
export class StoreService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Get Store Details
   */
  async read(): Promise<ApiResponse<ReadStoreResponse>> {
    const response = new ApiResponse<ReadStoreResponse>();

    const store = await this.dataSource.manager.findOne(Store, {
      where: {
        id: 1,
      },
    });

    response.message = 'Store Details';
    response.data = {
      store,
    };
    response.status = true;
    return response;
  }

  /**
   * Update Store Details
   */
  async update(
    params: UpdateStoreParams,
  ): Promise<ApiResponse<UpdateStoreResponse>> {
    const response = new ApiResponse<UpdateStoreResponse>();
    const updateStoreParams = plainToClass(UpdateStoreParams, params);
    const validationErrors = await validateAndExtract(updateStoreParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const {
      name,
      address1,
      address2,
      municipality: municipalityId,
      province: provinceId,
      baranggay: baranggayId,
      postalOrZip,
      contactNo,
      email,
      logo,
    } = updateStoreParams;

    /**
     * Update Store Details
     */
    const store = await this.dataSource.manager.findOne(Store, {
      where: {
        id: 1,
      },
    });
    store.name = name;
    if (logo) {
      store.logo = logo.filename;
    }
    if (address1) {
      store.address1 = address1;
    }
    if (address2) {
      store.address2 = address2;
    }
    if (provinceId) {
      const province = searchProvince({
        provinceId,
      });
      store.stateOrProvince = province[0];
    }
    if (municipalityId) {
      const municipality = searchMunicipality({
        provinceId,
        municipalityId,
      });
      store.cityOrTown = municipality[0];
    }
    if (baranggayId) {
      const _baranggay = searchBaranggay({
        provinceId,
        municipalityId,
        baranggayId,
      });
      store.baranggay = _baranggay[0];
    }
    if (postalOrZip) {
      store.postalOrZip = postalOrZip;
    }
    store.contactNo = contactNo;
    store.email = email;
    await this.dataSource.manager.save(store);
    response.status = true;
    response.message = 'Store successfully updated.';
    return response;
  }
}
