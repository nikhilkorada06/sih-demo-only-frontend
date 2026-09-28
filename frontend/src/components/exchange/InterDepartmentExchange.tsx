import React, { useEffect, useRef, useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  DataRequest, EXCHANGE_EVENT, EXCHANGE_KEY, createRequest, exchangeProfiles,
  isExchangeDepartment, otherDepartment, readRequests, requestOptions, reviewRequest
} from '../../mock/exchange';

const fieldLabels: Record<string, string> = {
  citizenId: 'Citizen ID', name: 'Citizen', dateOfBirth: 'Date of Birth', highestQualification: 'Highest Qualification',
  institution: 'Institution', course: 'Course', graduationYear: 'Graduation Year', enrollmentStatus: 'Enrollment Status',
  employmentStatus: 'Employment Status', employer: 'Employer', designation: 'Designation', employmentType: 'Employment Type', joiningYear: 'Joining Year'
};
const panel = 'rounded-xl border border-gov-border bg-white p-5 shadow-portal space-y-4 min-w-0';
const control = 'w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:ring-2 focus:ring-gov-blue';
const formatDate = (value: string) => new Date(value).toLocaleString('en-IN');

export const InterDepartmentExchange: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<DataRequest[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [requestedData, setRequestedData] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const inFlight = useRef(false);
  const admin = user?.role === 'admin';
  const department = user?.role === 'department_officer' && isExchangeDepartment(user.department) ? user.department : null;
  const target = department ? otherDepartment(department) : null;

  useEffect(() => {
    const refresh = () => {
      try { setRequests(readRequests()); setError(''); }
      catch { setError('Unable to read saved demo requests. Existing records have not been overwritten.'); }
    };
    const storage = (event: StorageEvent) => { if (event.key === EXCHANGE_KEY || event.key === null) refresh(); };
    refresh();
    window.addEventListener(EXCHANGE_EVENT, refresh);
    window.addEventListener('storage', storage);
    return () => {
      window.removeEventListener(EXCHANGE_EVENT, refresh);
      window.removeEventListener('storage', storage);
      clearTimeout(timer.current);
    };
  }, []);

  if (!user || (!admin && !department)) return null;
  const visible = requests.filter(r => admin || r.sourceDepartment === department || r.targetDepartment === department);
  const incoming = visible.filter(r => r.targetDepartment === department);
  const outgoing = visible.filter(r => r.sourceDepartment === department);
  const received = outgoing.filter(r => r.status === 'data_shared' && r.sharedData);
  const events = visible.flatMap(r => r.events).sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const perform = (label: string, operation: () => string) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(label); setError(''); setMessage(label);
    timer.current = setTimeout(() => {
      try { setMessage(operation()); }
      catch (err) { setError(err instanceof Error ? err.message : 'Could not save the request. Please try again.'); setMessage(''); }
      finally { inFlight.current = false; setBusy(''); }
    }, 1200);
  };
  const status = (request: DataRequest) => request.status === 'pending' ? 'Pending Approval' : request.status === 'rejected' ? 'Rejected' : request.sourceDepartment === department ? 'Data Received' : 'Data Shared';
  const requestCard = (request: DataRequest, canReview = false) => (
    <article key={request.id} aria-label={request.id} className="rounded-lg border border-gov-border bg-gov-surface p-4 space-y-3 break-words">
      <div className="flex flex-wrap justify-between gap-2">
        <h4 className="font-bold text-gov-dark">{request.id}</h4>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${request.status === 'pending' ? 'bg-amber-100 text-amber-800' : request.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-800'}`}>Status: {status(request)}</span>
      </div>
      <p className="text-xs text-slate-500">{request.sourceDepartment} → {request.targetDepartment}</p>
      <dl className="text-sm space-y-2">
        {Object.entries({ Citizen: request.citizenName, 'Requested Data': request.requestedData, Reason: request.reason, 'Target Department': request.targetDepartment, 'Request Date': formatDate(request.createdAt) }).map(([label, value]) => (
          <div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
      {request.status === 'pending' && <p className="text-xs text-amber-800">Awaiting approval from {request.targetDepartment} officer.</p>}
      {canReview && request.status === 'pending' && <div className="flex flex-wrap gap-2">
        <Button size="sm" disabled={!!busy} onClick={() => perform('Approving request...', () => {
          reviewRequest(user, request.id, true);
          return `✓ Request approved. ${department?.replace(' Department', '')} data has been shared with ${request.sourceDepartment}. Data shared successfully.`;
        })}>Approve &amp; Share Data</Button>
        <Button size="sm" variant="danger" disabled={!!busy} onClick={() => perform('Rejecting request...', () => {
          reviewRequest(user, request.id, false); return `Request ${request.id} rejected. No data was shared.`;
        })}>Reject Request</Button>
      </div>}
    </article>
  );

  return (
    <section aria-label="Inter-Department Data Exchange" className="space-y-5">
      <div className={panel}>
        <h2 className="flex items-center gap-2 text-xl font-bold text-gov-dark"><ArrowRightLeft className="shrink-0" size={22} />{admin ? 'Inter-Department Requests' : 'Inter-Department Data Exchange'}</h2>
        <p className="text-sm text-slate-600">Request and securely receive citizen information from other departments with departmental approval.</p>
        <p className="text-xs text-slate-500">Frontend-only simulation · Fictional demo records · Department officer approval required</p>
        {target && <Button disabled={!!busy} onClick={() => {
          setRequestedData(requestOptions[target][0]);
          setReason(target === 'Education Department' ? 'Required for employment application verification.' : 'Required for education scheme eligibility verification.');
          setOpen(true); setMessage(''); setError('');
        }}>Request Data from {target}</Button>}
        {!admin && <p className="text-sm text-slate-600">Pending incoming requests: <strong>{incoming.filter(r => r.status === 'pending').length}</strong></p>}
        {message && <p role="status" className={`rounded-lg p-3 text-sm ${busy ? 'bg-blue-50 text-blue-800 animate-pulse' : 'bg-green-50 text-green-800'}`}>{message}</p>}
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </div>
      {admin ? <section aria-label="All Data Requests" className={panel}>
        <h3 className="font-bold text-gov-dark">All Data Requests</h3>
        <p className="text-xs text-slate-500">Read-only overview. The receiving department officer reviews each request.</p>
        {visible.length ? visible.map(r => requestCard(r)) : <p className="text-sm text-slate-500">No data requests yet.</p>}
      </section> : <div className="grid gap-5 lg:grid-cols-2">
        <section aria-label="Incoming Data Requests" className={panel}>
          <h3 className="font-bold text-gov-dark">Incoming Data Requests</h3>
          {incoming.length ? incoming.map(r => requestCard(r, true)) : <p className="text-sm text-slate-500">No incoming requests yet.</p>}
        </section>
        <section aria-label="Outgoing Data Requests" className={panel}>
          <h3 className="font-bold text-gov-dark">Outgoing Data Requests</h3>
          {outgoing.length ? outgoing.map(r => requestCard(r)) : <p className="text-sm text-slate-500">No outgoing requests yet.</p>}
        </section>
      </div>}
      {received.map(request => <section key={request.id} aria-label={`${request.targetDepartment.replace(' Department', '')} Data Received`} className={panel}>
        <h3 className="text-lg font-bold text-gov-dark">{request.targetDepartment.replace(' Department', '')} Data Received</h3>
        <p className="text-sm text-green-700">✓ Data received through inter-department exchange</p>
        <p className="text-xs text-slate-500">Fictional mock/demo data. Approval shares this citizen’s sample profile.</p>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm break-words">
          {Object.entries(request.sharedData!).map(([key, value]) => <div key={key}><dt className="text-xs text-slate-500">{fieldLabels[key] || key}</dt><dd className="font-semibold">{value}</dd></div>)}
        </dl>
        <div className="border-t pt-3 text-xs text-slate-600 space-y-1 break-words">
          <p>Source Department: {request.targetDepartment}</p><p>Request ID: {request.id}</p>
          <p>Transfer Status: Approved</p><p>Approved by: {request.approvedBy}</p><p>Approved at: {formatDate(request.approvedAt!)}</p>
        </div>
      </section>)}
      <section aria-label="Data Exchange Audit Log" className={panel}>
        <h3 className="font-bold text-gov-dark">Data Exchange Audit Log</h3>
        {events.length ? <ol className="space-y-3 text-sm">{events.map(event => <li key={event._id} className="border-l-2 border-gov-blue pl-3 break-words">
          <time className="text-xs text-slate-500">{formatDate(event.timestamp)}</time><p>{event.action}</p>
          <p className="text-xs text-slate-500">Request ID: {event.resourceId} · {String(event.metadata?.actorName)}</p>
        </li>)}</ol> : <p className="text-sm text-slate-500">Request and review events will appear here.</p>}
      </section>
      {target && <Modal isOpen={open} onClose={() => { if (!inFlight.current) setOpen(false); }} title={`Request Data from ${target}`} showCloseButton={!busy}>
        <form className="space-y-4" onSubmit={event => {
          event.preventDefault();
          perform('Sending request...', () => {
            createRequest(user, requestedData, reason); setOpen(false);
            return `✓ Data request sent to ${target}. Request sent successfully. Status: Pending Approval. Awaiting approval from ${target} officer.`;
          });
        }}>
          <p className="text-xs text-slate-500">Requester: {department}<br />Target department: {target}</p>
          <label className="block text-sm font-semibold">Citizen<select className={control} value={exchangeProfiles[target].citizenId} disabled={!!busy} onChange={() => {}}><option value={exchangeProfiles[target].citizenId}>{exchangeProfiles[target].name}</option></select></label>
          <label className="block text-sm font-semibold">Data requested<select className={control} value={requestedData} disabled={!!busy} onChange={e => setRequestedData(e.target.value)}>{requestOptions[target].map(option => <option key={option}>{option}</option>)}</select></label>
          <label className="block text-sm font-semibold">Reason<textarea className={control} value={reason} onChange={e => setReason(e.target.value)} required maxLength={500} rows={3} disabled={!!busy} /></label>
          <p className="text-xs text-slate-500">No data is transferred until the other department’s officer approves. Approval shares the fictional sample profile shown in this demo.</p>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <Button type="submit" aria-busy={!!busy} disabled={!!busy || !reason.trim()}>{busy ? 'Sending request...' : 'Send Data Request'}</Button>
        </form>
      </Modal>}
    </section>
  );
};
