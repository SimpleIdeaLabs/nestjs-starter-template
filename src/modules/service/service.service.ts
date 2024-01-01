import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  CreateServiceParams,
  CreateServiceResponse,
  DeleteServiceParams,
  ListServiceParams,
  ListServiceResponse,
  ReadServiceParams,
  ReadServiceResponse,
  UpdateServiceParams,
  UpdateServiceResponse,
} from './service.dtos';
import { plainToClass } from 'class-transformer';
import { validateAndExtract } from 'class-validator-ext';
import { ERROR_TITLES } from '../../common/constants/constants';
import { ApiResponse } from '../../common/dtos/api-response';
import { UtilService } from '../../common/modules/global/util.service';
import { Service } from './service.entity';

@Injectable()
export class ServiceService {
  constructor(
    private readonly dataSource: DataSource,
    private utilService: UtilService,
  ) {}

  /**
   * List Paginated Services
   */
  async list(
    params: ListServiceParams,
  ): Promise<ApiResponse<ListServiceResponse>> {
    const response = new ApiResponse<ListServiceResponse>();
    const listServicesParams = plainToClass(ListServiceParams, params);
    const validationErrors = await validateAndExtract(listServicesParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { page, limit } = params;
    const skip = this.utilService.getSkipOffset({ page, limit });

    const serviceQuery = await this.dataSource.manager
      .createQueryBuilder(Service, 'service')
      .limit(limit)
      .offset(skip)
      .where('1 = 1')
      .orderBy('service.id', 'DESC');

    // filters
    const { name = null, category = null } = params;
    if (name) {
      serviceQuery.andWhere('service.name LIKE :name', {
        name: `%${name}%`,
      });
    }

    if (category) {
      serviceQuery.andWhere('service.category = :category', {
        category,
      });
    }

    const totalServices = await serviceQuery.getCount();
    const services = await serviceQuery.getMany();

    // response
    const total = Number(totalServices);
    response.data = {
      services,
      pagination: {
        total,
        page: Number(page),
        totalNumberOfPages: this.utilService.getTotalNumberOfPages({
          total,
          limit,
        }),
        limit,
      },
    };

    response.message = 'List of services offered.';
    return response;
  }

  /**
   * Create Service
   */
  async create(
    params: CreateServiceParams,
  ): Promise<ApiResponse<CreateServiceResponse>> {
    const response = new ApiResponse<CreateServiceResponse>();
    const createServiceParams = plainToClass(CreateServiceParams, params);
    const validationErrors = await validateAndExtract(createServiceParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { logo, name, category, price, description, currentUser } = params;

    // create service
    const service = new Service();
    service.logo = logo.filename;
    service.name = name;
    service.category = category;
    service.price = Number(price);
    service.description = description;
    service.createdBy = currentUser;
    service.updatedBy = currentUser;

    // save service
    await this.dataSource.manager.save(service);

    // response
    response.data = service;
    response.status = true;
    response.message = `${name} was successfully created`;

    return response;
  }

  /**
   * Update Service
   */
  async update(
    params: UpdateServiceParams,
  ): Promise<ApiResponse<UpdateServiceResponse>> {
    const response = new ApiResponse<UpdateServiceResponse>();
    const updateServiceParams = plainToClass(UpdateServiceParams, params);
    const validationErrors = await validateAndExtract(updateServiceParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const {
      serviceId,
      logo = null,
      name,
      category,
      price,
      description,
      currentUser,
    } = params;

    // create service
    const service = await this.dataSource.manager.findOne(Service, {
      where: {
        id: serviceId,
      },
    });

    if (!service) {
      response.status = false;
      response.message = 'Service not found.';
      throw new NotFoundException(response, ERROR_TITLES.NON_FOUND_ERROR);
    }

    // update service
    service.name = name;
    service.category = category;
    service.price = Number(price);
    service.description = description;
    if (logo) {
      service.logo = logo.filename;
    }
    service.updatedBy = currentUser;
    await this.dataSource.manager.save(service);

    // response
    response.data = {
      service,
    };
    response.status = true;
    response.message = `${name} was successfully updated.`;

    return response;
  }

  /**
   * Read Service
   */
  async read(params: ReadServiceParams) {
    const response = new ApiResponse<ReadServiceResponse>();
    const readServiceResponse = plainToClass(ReadServiceResponse, params);
    const validationErrors = await validateAndExtract(readServiceResponse);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { serviceId } = params;
    const service = await this.dataSource.manager.findOne(Service, {
      where: {
        id: serviceId,
      },
    });

    if (!service) {
      response.status = false;
      response.message = 'Service not found.';
      throw new NotFoundException(response, ERROR_TITLES.NON_FOUND_ERROR);
    }

    response.status = true;
    response.data = {
      service,
    };
    response.message = 'Service';

    return response;
  }

  /**
   * Delete Service
   */
  public async delete(
    params: DeleteServiceParams,
  ): Promise<ApiResponse<boolean>> {
    const response = new ApiResponse<boolean>();
    const deleteServiceParams = plainToClass(DeleteServiceParams, params);
    const validationErrors = await validateAndExtract(deleteServiceParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    let { serviceId } = deleteServiceParams;
    serviceId = Number(serviceId);
    const service = await this.dataSource.manager.findOne(Service, {
      where: {
        id: serviceId,
      },
    });

    if (!service) {
      response.status = false;
      response.message = 'Service not found.';
      throw new NotFoundException(response, ERROR_TITLES.NON_FOUND_ERROR);
    }

    await this.dataSource.manager.remove(service);
    response.message = `${service.name} successfully deleted.`;
    response.data = true;
    return response;
  }
}
