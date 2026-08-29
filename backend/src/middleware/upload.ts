import multer from 'multer';
import { AppError } from './errorHandler';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ALLOWED_EXTENSIONS: Record<string, Buffer[]> = {
  'image/jpeg': [Buffer.from([0xff, 0xd8, 0xff])],
  'image/png': [Buffer.from([0x89, 0x50, 0x4e, 0x47])],
  'image/webp': [
    Buffer.from([0x52, 0x49, 0x46, 0x46]),
    Buffer.from([0x57, 0x45, 0x42, 0x50]),
  ],
};

function checkMagicBytes(file: Express.Multer.File): boolean {
  const signatures = ALLOWED_EXTENSIONS[file.mimetype];
  if (!signatures) return false;

  const buffer = Buffer.from(file.buffer);
  for (const signature of signatures) {
    if (buffer.subarray(0, signature.length).equals(signature)) {
      return true;
    }
  }
  return false;
}

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(
      new AppError(
        400,
        `Invalid file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP`,
        'INVALID_FILE_TYPE'
      )
    );
    return;
  }
  if (!checkMagicBytes(file)) {
    cb(
      new AppError(
        400,
        'File content does not match its declared type',
        'INVALID_FILE_CONTENT'
      )
    );
    return;
  }
  cb(null, true);
}

const createUpload = (maxSize: number) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxSize },
    fileFilter,
  });

export const profileUpload = createUpload(5 * 1024 * 1024);
export const searchUpload = createUpload(10 * 1024 * 1024);
