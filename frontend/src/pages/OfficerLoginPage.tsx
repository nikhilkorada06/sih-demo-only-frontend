import { DemoCredentials } from '../components/common/DemoCredentials';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { ASSETS } from '../assets/assets';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';

export const OfficerLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const destination = '/admin'; // Redirect officers to the admin portal

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Please enter your officer email address and password.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      await login({ email: email.trim(), password, loginType: 'officer' });
      navigate(destination, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Invalid email address or password.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gov-surface flex items-center py-10 px-4">
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center">
          <img src={ASSETS.logo} alt="MahaSetu" className="h-12 w-auto object-contain mx-auto rounded-md" />
          <h1 className="text-2xl font-bold text-gov-dark mt-4">Officer / Admin Portal Login</h1>
          <p className="text-xs text-gov-textSecondary mt-1">Authorized personnel only</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gov-border shadow-portal p-6 sm:p-8">
          {error && (
            <div role="alert" className="p-3.5 mb-5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0"/>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={submit} className="space-y-4">
            <Input 
              label="Officer Email Address" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              leftIcon={<Mail size={16}/>} 
              autoComplete="email" 
              required 
            />
            <Input 
              id="login-password" 
              label="Password" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              leftIcon={<Lock size={16}/>} 
              autoComplete="current-password" 
              required 
            />
            <div className="p-3 bg-gov-lightblue border border-gov-border rounded-lg flex gap-2 text-xs text-gov-textSecondary">
              <ShieldCheck size={16} className="text-green-600 shrink-0"/>
              Demo access for department officers and system administrators.
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading} rightIcon={<ArrowRight size={16}/>}>
              Sign In
            </Button>
          </form>
          <DemoCredentials loginType="officer" disabled={isLoading} onSelect={(email, password) => { setEmail(email); setPassword(password); setError(''); }} />
          
          <div className="pt-4 mt-5 border-t text-center text-xs text-gov-textSecondary">
            <ShieldCheck size={16} className="inline mr-1 text-gov-blue"/>
            MahaSetu Demonstration Portal
          </div>
        </div>
      </div>
    </div>
  );
};
