import React from 'react';
import { demoUsers } from '../../mock/data';

export const DemoCredentials: React.FC<{
  loginType: 'citizen' | 'officer';
  disabled: boolean;
  onSelect: (email: string, password: string) => void;
}> = ({ loginType, disabled, onSelect }) => (
  <section className="mt-6 border-t border-gov-border pt-5 space-y-3" aria-label="Demo Credentials">
    <h2 className="text-sm font-bold text-gov-dark">Demo Credentials</h2>
    <p className="text-xs text-slate-500">Public demo accounts for demonstration.</p>
    {demoUsers.filter(user => loginType === 'citizen' ? user.role === 'citizen' : user.role !== 'citizen').map(user => (
      <div key={user.id} className="rounded-lg border border-gov-border bg-gov-surface p-3 text-xs space-y-2">
        <h3 className="font-semibold text-gov-dark">{user.role === 'citizen' ? 'Citizen' : user.role === 'admin' ? 'System Administrator' : user.department?.replace(' Department', ' Officer')}</h3>
        <p className="break-all">Email: {user.email}</p>
        <p>Password: {user.password}</p>
        <button type="button" disabled={disabled} onClick={() => onSelect(user.email, user.password)} className="font-semibold text-gov-blue hover:underline disabled:opacity-50">Use Credentials</button>
      </div>
    ))}
  </section>
);
