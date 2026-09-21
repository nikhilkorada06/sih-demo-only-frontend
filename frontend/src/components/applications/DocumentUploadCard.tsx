import React, { useEffect, useState } from 'react';
import { ExternalLink, FileText, Trash2, Upload } from 'lucide-react';
import { documentsApi } from '../../api/documents.api';
import { UploadedDocument } from '../../types/document.types';
import { extractErrorMessage } from '../../api/client';
import { Button } from '../common/Button';

export const DocumentUploadCard: React.FC<{ applicationId: string; canManage: boolean }> = ({ applicationId, canManage }) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('Supporting Document');
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => setDocuments(await documentsApi.list(applicationId));
  useEffect(() => { load().catch(err => setError(extractErrorMessage(err, 'Failed to load documents.'))); }, [applicationId]);

  const upload = async () => {
    if (!file) return setError('Select a PDF, JPEG, or PNG document.');
    setBusy(true); setError(''); setMessage(''); setProgress(0);
    try {
      await documentsApi.upload(applicationId, file, documentType, setProgress);
      setFile(null); setMessage('Document uploaded successfully.'); await load();
    } catch (err) { setError(extractErrorMessage(err, 'Document upload failed.')); }
    finally { setBusy(false); }
  };

  const remove = async (id: string) => {
    setBusy(true); setError('');
    try { await documentsApi.remove(applicationId, id); setMessage('Document deleted successfully.'); await load(); }
    catch (err) { setError(extractErrorMessage(err, 'Document deletion failed.')); }
    finally { setBusy(false); }
  };

  return <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
    <div className="flex items-center gap-3"><Upload className="text-gov-blue" size={22} /><div><h3 className="text-sm font-bold text-gov-navy">Application Documents</h3><p className="text-xs text-slate-500">PDF, JPEG or PNG · maximum 10 MB</p></div></div>
    {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">{error}</div>}
    {message && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">{message}</div>}
    {canManage && <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto] items-end">
      <label className="text-xs font-semibold text-slate-700">Document Type<input aria-label="Document Type" value={documentType} onChange={e => setDocumentType(e.target.value)} className="mt-1.5 w-full px-3 py-2 border rounded-lg" /></label>
      <label className="text-xs font-semibold text-slate-700">Choose File<input aria-label="Choose File" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={e => setFile(e.target.files?.[0] || null)} className="mt-1.5 block w-full text-xs" /></label>
      <Button onClick={upload} isLoading={busy} disabled={!file}>Upload</Button>
      {busy && progress > 0 && <div className="sm:col-span-3 text-xs text-gov-blue">Uploading: {progress}%</div>}
    </div>}
    <div className="space-y-2">
      {documents.length === 0 ? <p className="text-xs text-slate-500">No documents uploaded for this application.</p> : documents.map(doc => <div key={doc._id} className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border rounded-xl">
        <div className="flex items-center gap-2 min-w-0"><FileText size={18} className="text-gov-blue" /><div className="min-w-0"><p className="text-xs font-bold truncate">{doc.documentType}</p><p className="text-[11px] text-slate-500 truncate">{doc.originalFileName} · {(doc.fileSize / 1024).toFixed(1)} KB</p></div></div>
        <div className="flex gap-2"><a href={doc.cloudinarySecureUrl} target="_blank" rel="noreferrer" className="p-2 text-gov-blue" aria-label={`Open ${doc.originalFileName}`}><ExternalLink size={16} /></a>{canManage && <button onClick={() => remove(doc._id)} disabled={busy} className="p-2 text-rose-600" aria-label={`Delete ${doc.originalFileName}`}><Trash2 size={16} /></button>}</div>
      </div>)}
    </div>
  </div>;
};
