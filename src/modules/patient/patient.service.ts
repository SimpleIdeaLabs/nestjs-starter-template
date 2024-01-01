import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateAndExtract } from 'class-validator-ext';
import { DataSource } from 'typeorm';
import { ERROR_TITLES } from '../../common/constants/constants';
import { ApiResponse } from '../../common/dtos/api-response';
import { UtilService } from '../../common/modules/global/util.service';
import { PatientDocument } from './patient-document.entity';
import { PatientPhoto } from './patient-photo.entity';
import {
  CreatePatientParams,
  DeletePatientDocumentsParams,
  DeletePatientPhotosParams,
  ListPatientsParams,
  ListPatientsResponse,
  PatientDetailParams,
  UploadPatientDocumentsParams,
  UploadPatientPhotosParams,
} from './patient.dto';
import { Patient } from './patient.entity';

@Injectable()
export class PatientService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly utilService: UtilService,
  ) {}

  /**
   * Create Patient
   */
  public async create(
    params: CreatePatientParams,
  ): Promise<ApiResponse<Patient>> {
    const response = new ApiResponse<Patient>();
    const createUserParams = plainToClass(CreatePatientParams, params);
    const validationErrors = await validateAndExtract(createUserParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { firstName, middleName, lastName, email, birthDate, currentUser } =
      params;

    // create patient
    const patient = new Patient();
    patient.firstName = firstName;
    patient.middleName = middleName;
    patient.lastName = lastName;
    patient.email = email;
    patient.birthDate = birthDate;
    patient.createdBy = currentUser;
    patient.updatedBy = currentUser;
    patient.generateControlNo();

    await this.dataSource.manager.save(patient);

    response.status = true;
    response.data = patient;
    response.message = `${firstName} ${lastName} was successfully created`;
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
    const { currentUser, patientId, files, type, description } = params;

    // create photos
    const filesToSave = [];

    for (const file of files) {
      const patientDoc = new PatientDocument();
      patientDoc.createdBy = currentUser;
      patientDoc.updatedBy = currentUser;
      patientDoc.path = file.path;
      patientDoc.patientId = patientId;
      patientDoc.type = type;
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
          limit,
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
