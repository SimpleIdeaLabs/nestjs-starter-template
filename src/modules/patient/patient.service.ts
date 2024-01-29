import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateAndExtract } from 'class-validator-ext';
import { DataSource } from 'typeorm';
import { ERROR_TITLES } from '../../common/constants/constants';
import { ApiResponse } from '../../common/dtos/api-response';
import { UtilService } from '../../common/modules/global/util.service';
import { PatientDocument } from './patient-document.entity';
import { PatientPhoto } from './patient-photo.entity';
import {
  PatientPersonalInformationParams,
  DeletePatientDocumentsParams,
  DeletePatientPhotosParams,
  ListPatientsParams,
  ListPatientsResponse,
  PatientDetailParams,
  UploadPatientDocumentsParams,
  UploadPatientPhotosParams,
  UpdatePatientPersonalInformationParams,
  UpdatePatientContactInformationParams,
  UpdatePatientAddressInformationParams,
} from './patient.dto';
import { Patient } from './patient.entity';

@Injectable()
export class PatientService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly utilService: UtilService,
  ) {}

  /**
   * Create Patient Personal Information
   */
  public async createPersonalInformation(
    params: PatientPersonalInformationParams,
  ): Promise<ApiResponse<Patient>> {
    const response = new ApiResponse<Patient>();
    const createUserParams = plainToClass(
      PatientPersonalInformationParams,
      params,
    );
    const validationErrors = await validateAndExtract(createUserParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { firstName, middleName, lastName, birthDate, gender, currentUser } =
      params;

    // create patient
    const patient = new Patient();
    patient.firstName = firstName;
    patient.middleName = middleName;
    patient.lastName = lastName;
    patient.birthDate = birthDate;
    patient.gender = gender;
    patient.createdBy = currentUser;
    patient.updatedBy = currentUser;
    await this.dataSource.manager.save(patient);

    patient.generateControlNo();
    await this.dataSource.manager.save(patient);

    response.status = true;
    response.data = patient;
    response.message = `${firstName} ${lastName} was successfully created`;
    return response;
  }

  /**
   * Update Patient Personal Information
   */
  public async updatePersonalInformation(
    params: UpdatePatientPersonalInformationParams,
  ): Promise<ApiResponse<Patient>> {
    const response = new ApiResponse<Patient>();
    const updateUserParams = plainToClass(
      UpdatePatientPersonalInformationParams,
      params,
    );
    const validationErrors = await validateAndExtract(updateUserParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const {
      patientId,
      firstName,
      middleName,
      lastName,
      birthDate,
      gender,
      currentUser,
    } = params;

    const existingPatient = await this.dataSource.manager.findOne(Patient, {
      where: {
        id: Number(patientId),
      },
    });

    if (!existingPatient) {
      response.status = false;
      response.message = 'Patient not found.';
      throw new NotFoundException(response, ERROR_TITLES.NON_FOUND_ERROR);
    }

    // create patient
    existingPatient.firstName = firstName;
    existingPatient.middleName = middleName;
    existingPatient.lastName = lastName;
    existingPatient.birthDate = birthDate;
    existingPatient.gender = gender;
    existingPatient.updatedBy = currentUser;

    await this.dataSource.manager.save(existingPatient);

    response.status = true;
    response.data = existingPatient;
    response.message = `${firstName} ${lastName} was successfully updated`;
    return response;
  }

  /**
   * Update Patient Contact Information
   */
  public async updateContactInformation(
    params: UpdatePatientContactInformationParams,
  ): Promise<ApiResponse<Patient>> {
    const response = new ApiResponse<Patient>();
    const updateParams = plainToClass(
      UpdatePatientContactInformationParams,
      params,
    );
    const validationErrors = await validateAndExtract(updateParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { patientId, mobileNo, email } = params;

    const existingPatient = await this.dataSource.manager.findOne(Patient, {
      where: {
        id: Number(patientId),
      },
    });

    if (!existingPatient) {
      response.status = false;
      response.message = 'Patient not found.';
      throw new NotFoundException(response, ERROR_TITLES.NON_FOUND_ERROR);
    }

    // create patient
    existingPatient.mobileNo = mobileNo;
    existingPatient.email = email;

    await this.dataSource.manager.save(existingPatient);

    response.status = true;
    response.data = existingPatient;
    response.message = `${existingPatient.firstName} ${existingPatient.lastName} contact information was successfully updated`;
    return response;
  }

  /**
   * Update Patient Address Information
   */
  public async updateAddressInformation(
    params: UpdatePatientAddressInformationParams,
  ): Promise<ApiResponse<Patient>> {
    const response = new ApiResponse<Patient>();
    const updateParams = plainToClass(
      UpdatePatientAddressInformationParams,
      params,
    );
    const validationErrors = await validateAndExtract(updateParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const {
      patientId,
      houseNo = '',
      street = '',
      cityOrTown = '',
      provinceOrRegion = '',
      postal = '',
      country = '',
    } = params;

    const existingPatient = await this.dataSource.manager.findOne(Patient, {
      where: {
        id: Number(patientId),
      },
    });

    if (!existingPatient) {
      response.status = false;
      response.message = 'Patient not found.';
      throw new NotFoundException(response, ERROR_TITLES.NON_FOUND_ERROR);
    }

    // create patient
    existingPatient.houseNo = houseNo;
    existingPatient.street = street;
    existingPatient.cityOrTown = cityOrTown;
    existingPatient.provinceOrRegion = provinceOrRegion;
    existingPatient.postal = postal;
    existingPatient.country = country;

    await this.dataSource.manager.save(existingPatient);

    response.status = true;
    response.data = existingPatient;
    response.message = `${existingPatient.firstName} ${existingPatient.lastName} address information was successfully updated`;
    return response;
  }

  /**
   * Upload Patient Photos
   */
  public async uploadPhoto(
    params: UploadPatientPhotosParams,
  ): Promise<ApiResponse<PatientPhoto[]>> {
    const response = new ApiResponse<PatientPhoto[]>();
    const uploadPhotoParams = plainToClass(UploadPatientPhotosParams, params);
    const validationErrors = await validateAndExtract(uploadPhotoParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { currentUser, patientId, files } = params;

    // create photos
    const filesToSave = [];

    for (const file of files) {
      const patientPhoto = new PatientPhoto();
      patientPhoto.createdBy = currentUser;
      patientPhoto.updatedBy = currentUser;
      patientPhoto.path = file.path;
      const patient = plainToClass(Patient, { id: patientId });
      patientPhoto.patient = patient;
      filesToSave.push(patientPhoto);
    }

    await this.dataSource.manager.save(filesToSave);

    response.data = filesToSave;
    response.status = true;
    response.message = 'Upload patient photo successful';
    return response;
  }

  /**
   * Delete Patient Photos
   */
  public async deletePhoto(
    params: DeletePatientPhotosParams,
  ): Promise<ApiResponse<boolean>> {
    const response = new ApiResponse<boolean>();

    const deletePatientPhotosParams = plainToClass(
      DeletePatientPhotosParams,
      params,
    );
    const validationErrors = await validateAndExtract(
      deletePatientPhotosParams,
    );

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.data = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { patientId, photoIds, currentUser } = deletePatientPhotosParams;

    await this.dataSource.manager
      .createQueryBuilder(PatientPhoto, 'patientPhoto')
      .update(PatientPhoto)
      .set({ deleted: true, updatedBy: currentUser })
      .where('patientId = :patientId AND id IN (:photoIds)', {
        patientId,
        photoIds,
      })
      .execute();

    response.status = true;
    response.data = true;
    response.message = 'Photos deleted';
    return response;
  }

  /**
   * Upload Patient Documents
   */
  public async uploadDocuments(
    params: UploadPatientDocumentsParams,
  ): Promise<ApiResponse<PatientDocument[]>> {
    const response = new ApiResponse<PatientDocument[]>();
    const uploadDocumentsParams = plainToClass(
      UploadPatientDocumentsParams,
      params,
    );
    const validationErrors = await validateAndExtract(uploadDocumentsParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { currentUser, patientId, files, type, description, tags } = params;

    // create photos
    const filesToSave = [];

    for (const file of files) {
      const patientDoc = new PatientDocument();
      patientDoc.createdBy = currentUser;
      patientDoc.updatedBy = currentUser;
      patientDoc.path = file.path;
      patientDoc.patientId = patientId;
      patientDoc.type = type;
      patientDoc.tags = tags;
      patientDoc.description = description;
      filesToSave.push(patientDoc);
    }

    await this.dataSource.manager.save(filesToSave);

    response.data = filesToSave;
    response.status = true;
    response.message = 'Upload patient docs successful';
    return response;
  }

  /**
   * Delete Patient Documents
   */
  public async deleteDocuments(
    params: DeletePatientDocumentsParams,
  ): Promise<ApiResponse<boolean>> {
    const response = new ApiResponse<boolean>();

    const deletePatientDocsParams = plainToClass(
      DeletePatientDocumentsParams,
      params,
    );
    const validationErrors = await validateAndExtract(deletePatientDocsParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.data = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { patientId, documentIds, currentUser } = deletePatientDocsParams;

    await this.dataSource.manager
      .createQueryBuilder(PatientDocument, 'patientDocument')
      .update(PatientDocument)
      .set({ deleted: true, updatedBy: currentUser })
      .where('patientId = :patientId AND id IN (:documentIds)', {
        patientId,
        documentIds,
      })
      .execute();

    response.status = true;
    response.data = true;
    response.message = 'Documents deleted';
    return response;
  }

  /**
   * List Patients
   */
  public async list(
    params: ListPatientsParams,
  ): Promise<ApiResponse<ListPatientsResponse>> {
    const response = new ApiResponse<ListPatientsResponse>();

    const readPatientsParams = plainToClass(ListPatientsParams, params);
    const validationErrors = await validateAndExtract(readPatientsParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { page = 1, limit = 10 } = readPatientsParams;
    let total = 0;
    let patients = [];
    const skip = this.utilService.getSkipOffset({ page, limit });

    const patientQuery = await this.dataSource.manager
      .createQueryBuilder(Patient, 'patient')
      .take(limit)
      .skip(skip)
      .leftJoinAndSelect('patient.photos', 'photos')
      .where('1 = 1');

    total = await patientQuery.getCount();
    patients = await patientQuery.getMany();

    // response
    response.data = {
      patients,
      pagination: {
        total: Number(total),
        page: Number(page),
        totalNumberOfPages: this.utilService.getTotalNumberOfPages({
          total: Number(total),
          limit: Number(limit),
        }),
        limit,
      },
    };
    response.status = true;
    response.message = `Get list of patients`;

    return response;
  }

  /**
   * Patient Detail
   */
  public async detail(
    params: PatientDetailParams,
  ): Promise<ApiResponse<Patient>> {
    const response = new ApiResponse<Patient>();

    const patientDetailParams = plainToClass(PatientDetailParams, params);
    const validation = await validateAndExtract(patientDetailParams);

    if (!validation.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validation.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { patientId } = patientDetailParams;

    const patient = await this.dataSource.manager
      .createQueryBuilder(Patient, 'patient')
      .leftJoinAndSelect(
        'patient.photos',
        'photo',
        'photo.deleted = :isDeleted',
        { isDeleted: false },
      )
      .leftJoinAndSelect(
        'patient.documents',
        'document',
        'document.deleted = :isDeleted',
        { isDeleted: false },
      )
      .where('patient.id = :patientId', { patientId })
      .getOne();

    // response
    response.status = true;
    response.data = patient;
    response.message = 'Patient Details';

    return response;
  }

  /**
   * Search Patient
   */
  public async search(
    params: PatientDetailParams,
  ): Promise<ApiResponse<Patient>> {
    const response = new ApiResponse<Patient>();

    const patientDetailParams = plainToClass(PatientDetailParams, params);
    const validation = await validateAndExtract(patientDetailParams);

    if (!validation.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validation.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { patientId } = patientDetailParams;

    const patient = await this.dataSource.manager.findOne(Patient, {
      where: {
        id: patientId,
      },
      relations: ['photos', 'documents'],
    });

    // response
    response.status = true;
    response.data = patient;
    response.message = 'Patient Details';

    return response;
  }
}
