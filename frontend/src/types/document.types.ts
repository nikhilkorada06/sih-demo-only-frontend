export interface UploadedDocument {
  _id: string;
  applicationId: string;
  originalFileName: string;
  cloudinarySecureUrl: string;
  resourceType: 'image' | 'raw';
  format: string;
  mimeType: string;
  fileSize: number;
  documentType: string;
  uploadedAt: string;
}
