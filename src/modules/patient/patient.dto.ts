import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
} from 'class-validator';
import { extend } from 'lodash';
import {
  PaginatedParams,
  PaginatedResponse,
} from '../../common/dtos/pagination';
import { IsPatientDocsValid } from '../../common/validators/patient-docs.validatos';
import { IsPatientExists } from '../../common/validators/patient-exists.validator';
import { IsPatientPhotoValid } from '../../common/validators/patient-photo.validator';
import { User } from '../user/user.entity';
import { PATIENT_DOCS_CATEGORY } from './patient.constants';
import { Patient } from './patient.entity';

export class CreatePatientParams {
  @IsNotEmpty({
    message: 'First Name is required',
  })
  firstName: string;

  @IsNotEmpty({
    message: 'Middle Name is required',
  })
  middleName: string;

  @IsNotEmpty({
    message: 'Last Name is required',
  })
  lastName: string;

  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail(
    {},
    {
      message: 'Provide a valid email',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'Birth Date is required',
  })
  @IsDateString(
    {},
    {
      message: 'Provide a valid birth date',
    },
  )
  birthDate: Date;

  @IsNotEmpty()
  currentUser: User;

  // @IsArray({
  //   message: 'Photo should be an array',
  // })
  // @ArrayNotEmpty()
  // photos: PatientPhoto[];
}

export class UploadPatientPhotosParams {
  @IsNotEmpty({
    message: 'Patient is required',
  })
  @IsPatientExists()
  patientId: number;

  @IsNotEmpty()
  currentUser: User;

  @IsPatientPhotoValid()
  files: any[];
}

export class DeletePatientPhotosParams {
  @IsNotEmpty({
    message: 'Patient is required',
  })
  @IsPatientExists()
  patientId: number;

  @IsArray()
  @ArrayNotEmpty()
  photoIds: number[];

  @IsNotEmpty()
  currentUser: User;
}

export class UploadPatientDocumentsParams {
  @IsNotEmpty({
    message: 'Patient is required',
  })
  @IsPatientExists()
  patientId: number;

  @IsNotEmpty()
  currentUser: User;

  @IsNotEmpty({
    message: 'Description is required',
  })
  description: string;

  @IsNotEmpty({
    message: 'Category is required',
  })
  @IsIn(PATIENT_DOCS_CATEGORY, {
    message: 'Type is invalid',
  })
  type: string;

  @IsPatientDocsValid()
  files: any[];
}

export class DeletePatientDocumentsParams {
  @IsNotEmpty({
    message: 'Patient is required',
  })
  @IsPatientExists()
  patientId: number;

  @IsArray()
  @ArrayNotEmpty()
  documentIds: number[];

  @IsNotEmpty()
  currentUser: User;
}

export class ListPatientsParams extends PaginatedParams {}

export class ListPatientsResponse {
  patients: Patient[];
  pagination: PaginatedResponse;
}

export class PatientDetailParams {
  @IsNotEmpty({
    message: 'Patient is required',
  })
  @IsPatientExists()
  patientId: number;
}
