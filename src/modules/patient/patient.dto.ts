import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
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
import { IsGenderValid } from 'src/common/validators/is-gender-valid';

export class PatientPersonalInformationParams {
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
    message: 'Gender is required',
  })
  @IsGenderValid()
  gender: string;

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
}

export class UpdatePatientPersonalInformationParams extends PatientPersonalInformationParams {
  @IsNotEmpty({
    message: 'Patient ID is required',
  })
  patientId: string;
}

export class PatientContactInformationParams {
  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty({
    message: 'Mobile Number is required',
  })
  mobileNo: string;
}

export class UpdatePatientContactInformationParams extends PatientContactInformationParams {
  @IsNotEmpty({
    message: 'Patient ID is required',
  })
  patientId: string;
}

export class PatientAddressInformationParams {
  @IsOptional()
  houseNo: string;

  @IsOptional()
  street: string;

  @IsOptional()
  cityOrTown: string;

  @IsOptional()
  provinceOrRegion: string;

  @IsOptional()
  postal: string;

  @IsOptional()
  country: string;
}

export class UpdatePatientAddressInformationParams extends PatientAddressInformationParams {
  @IsNotEmpty({
    message: 'Patient ID is required',
  })
  patientId: string;
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

  @IsNotEmpty({
    message: 'Tags is required',
  })
  tags: string[];

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
