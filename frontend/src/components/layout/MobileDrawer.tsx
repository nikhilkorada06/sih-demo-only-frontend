import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  X,
  Home,
  FileText,
  Building2,
  FolderLock,
  MessageSquare,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Award,
  UserCircle
} from 'lucide-react';
import { ASSETS } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, Language } from '../../context/LanguageContext';
import { Button } from '../common/Button';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAccessibilityModal: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAccessibilityModal
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const links = [
    { to: '/', label: t('nav.home'), icon: <Home size={18} /> },
    { to: '/departments', label: t('nav.departments'), icon: <Building2 size={18} /> },
    { to: '/documents', label: t('nav.documents'), icon: <FolderLock size={18} /> },
    { to: '/grievances', label: t('nav.grievances'), icon: <MessageSquare size={18} /> },
    { to: '/employment', label: 'Employment', icon: <Award size={18} /> },
    { to: '/employment/applications', label: 'Track Applications', icon: <FileText size={18} /> },
    { to: '/profile', label: 'My Profile', icon: <UserCircle size={18} /> }
  ];

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-up overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gov-border bg-gov-surface">
            <img
              src={ASSETS.logo}
              alt="MahaSetu"
              className="h-10 w-auto object-contain rounded-md"
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          </div>

          {/* User profile strip if logged in */}
          {isAuthenticated && user ? (
            <div className="p-4 bg-gov-lightblue border-b border-gov-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gov-blue text-white flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-gov-textPrimary text-sm truncate">{user.name}</p>
                <p className="text-[11px] text-gov-textSecondary capitalize">{user.role}</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gov-surface border-b border-gov-border">
              <Link
                to="/login"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-gov-blue hover:bg-gov-dark text-white text-sm font-medium rounded-lg shadow-xs"
              >
                {t('nav.login')}
              </Link>
            </div>
          )}

          {/* Links */}
          <nav className="p-3 space-y-1">
            {links.map((link) => {
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gov-lightblue text-gov-blue font-bold'
                        : 'text-gov-textPrimary hover:bg-gov-surface'
                    }`
                  }
                >
                  <span className="text-gov-blue">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom utility strip */}
        <div className="p-4 border-t border-gov-border bg-gov-surface space-y-3">
          <div className="flex items-center justify-between text-xs text-gov-textSecondary">
            <span>Language / भाषा:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                  language === 'en' ? 'bg-gov-blue text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                  language === 'hi' ? 'bg-gov-blue text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('mr')}
                className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                  language === 'mr' ? 'bg-gov-blue text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                मराठी
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenAccessibilityModal();
            }}
            className="w-full py-2 text-xs text-gov-blue font-medium bg-white rounded-lg border border-gov-border hover:bg-gov-lightblue text-center cursor-pointer"
          >
            Accessibility Options
          </button>

          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                onClose();
                navigate('/login');
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs text-red-600 font-semibold bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
