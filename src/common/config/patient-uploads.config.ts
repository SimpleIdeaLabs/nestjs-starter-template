import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 } from 'uuid';

/**
 * Maximum Photos Per Upload
 */
export const MAX_PATIENT_PHOTOS_PER_UPLOAD = 5;

/**
 * Maximum Documents Per Upload
 */
export const MAX_PATIENT_DOCUMENTS_PER_UPLOAD = 10;

/**
 * Profile Photos
 */
export const profilePhotosStorage = diskStorage({
  destination: './uploads/profile-photos',
  filename: (req, file, cb) => {
    const fileName = v4();
    const fileExt = path.extname(file.originalname);
    cb(null, `${fileName}${fileExt}`);
  },
});

/**
 * Patient Photos Destination
 */
export const patientPhotosStorage = diskStorage({
  destination: './uploads/patient/photos',
  filename: (req, file, cb) => {
    const fileName = v4();
    const fileExt = path.extname(file.originalname);
    cb(null, `${fileName}${fileExt}`);
  },
});

/**
 * Patient Docs Destination
 */
export const patientDocsStorage = diskStorage({
  destination: './uploads/patient/documents',
  filename: (req, file, cb) => {
    const fileName = v4();
    const fileExt = path.extname(file.originalname);
    cb(null, `${fileName}${fileExt}`);
  },
});
