import { apiClient } from './client';
import { UploadedDocument } from '../types/document.types';

export const documentsApi = {
  async list(applicationId: string): Promise<UploadedDocument[]> {
    const { data } = await apiClient.get<{ documents: UploadedDocument[] }>(`/applications/${applicationId}/documents`);
    return data.documents;
  },
  async upload(applicationId: string, file: File, documentType: string, onProgress: (percent: number) => void): Promise<UploadedDocument> {
    const form = new FormData();
    form.append('file', file);
    form.append('documentType', documentType);
    const { data } = await apiClient.post<{ document: UploadedDocument }>(`/applications/${applicationId}/documents`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event: { loaded: number; total?: number }) => onProgress(event.total ? Math.round((event.loaded * 100) / event.total) : 0)
    } as any);
    return data.document;
  },
  async remove(applicationId: string, documentId: string): Promise<void> {
    await apiClient.delete(`/applications/${applicationId}/documents/${documentId}`);
  }
};
