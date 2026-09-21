import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, ShieldCheck, ExternalLink, MapPin, Clock } from 'lucide-react';
import { ASSETS } from '../../assets/assets';

export interface FooterProps {
  onOpenAccessibilityModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAccessibilityModal }) => {
  return (
    <footer className="bg-gov-lightblue text-gov-textPrimary border-t border-gov-blue/20 select-none">
      {/* Upper Structured Grid */}
      <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand & Official Mission */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={ASSETS.logo}
                alt="MahaSetu — Government of Maharashtra"
                className="h-12 w-auto object-contain rounded-md"
              />
            </Link>
            <p className="text-xs text-gov-textSecondary leading-relaxed">
              MahaSetu is the unified digital public services integration platform of the Government of Maharashtra, enabling seamless, paperless, and consent-driven access to state services.
            </p>
            <div className="pt-1 text-xs font-semibold text-gov-blue font-marathi">
              महाराष्ट्र शासन • एक सेतू, सर्व सेवा
            </div>
          </div>

          {/* Column 2: Get to Know */}
          <div>
            <h4 className="text-sm font-bold text-gov-blue uppercase tracking-wider mb-4 pb-1 border-b border-gov-blue/15">
              Get to Know
            </h4>
            <ul className="space-y-2.5 text-xs text-gov-textSecondary">
              <li>
                <Link to="/help" className="hover:text-gov-blue transition-colors">
                  About MahaSetu
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-gov-blue transition-colors">
                  Privacy Policy & DPDP Act 2023
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-gov-blue transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-gov-blue transition-colors">
                  Frequently Asked Questions (FAQs)
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenAccessibilityModal}
                  className="hover:text-gov-blue transition-colors text-left cursor-pointer"
                >
                  Accessibility Statement
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gov-blue uppercase tracking-wider mb-4 pb-1 border-b border-gov-blue/15">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-gov-textSecondary">
              <li>
                <Link to="/" className="hover:text-gov-blue transition-colors">
                  Home Portal
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-gov-blue transition-colors">
                  Government Departments
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-gov-blue transition-colors">
                  Digital Credentials & Vault
                </Link>
              </li>
              <li>
                <Link to="/grievances" className="hover:text-gov-blue transition-colors">
                  Lodge Grievance (RTS)
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-gov-blue transition-colors">
                  Help Center & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Useful Links & Citizen Helplines */}
          <div>
            <h4 className="text-sm font-bold text-gov-blue uppercase tracking-wider mb-4 pb-1 border-b border-gov-blue/15">
              Useful Links & Help
            </h4>
            <div className="space-y-3 text-xs text-gov-textSecondary">
              <div className="bg-white p-3 rounded-lg border border-gov-border shadow-xs">
                <span className="text-[11px] text-slate-500 block font-medium">Toll-Free Helpline:</span>
                <span className="text-base font-bold text-gov-blue font-mono">1800-120-8040</span>
                <span className="text-[10px] text-green-700 font-semibold block mt-0.5">24x7 Multi-lingual Support</span>
              </div>

              <div className="space-y-1 text-xs">
                <p>Aaple Sarkar Helpline: <strong className="text-gov-blue">1905</strong></p>
                <p>Support Email: <strong className="text-gov-blue">support@mahasetu.gov.in</strong></p>
                <p>Mantralaya, Madam Cama Road, Mumbai 400032</p>
              </div>
            </div>
          </div>
        </div>

        {/* DPDP Compliance Strip */}
        <div className="bg-white/80 rounded-xl border border-gov-border p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-green-700 flex-shrink-0" />
            <div>
              <span className="font-bold text-gov-textPrimary">DPDP Act 2023 Compliant</span>
              <span className="text-gov-textSecondary ml-2 hidden sm:inline">
                Citizen data exchanges require explicit digital consent.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gov-textSecondary font-medium">
            <span>256-bit PKI Encryption</span>
            <span>•</span>
            <span className="text-green-700 font-semibold">State Interoperability Engine Active</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Strip */}
      <div className="bg-gov-blue text-white py-3.5 border-t border-gov-dark/30">
        <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p className="text-blue-100">
            MahaSetu is the official unified digital service integration platform of Maharashtra.
          </p>
          <p className="text-blue-200">
            © 2026 Government of Maharashtra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
