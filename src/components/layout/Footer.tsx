import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Info, Scale, HelpCircle, ShieldCheck, Scale as ScaleIcon, Cookie, ClipboardList, Globe, Mail, Users } from 'lucide-react';
import Logo from '../common/Logo';

// Footer component with updated styling and layout

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white mt-0">
      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-5 mb-3 footer-grid">
          {/* Column 1: Logo and Branding */}
          <div className="footer-branding">
            <Link to="/" className="flex items-center gap-3 mb-3">
              <Logo size={48} light />
              <div className="flex flex-col justify-center leading-tight">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-white">SocialCaution</span>
                  <span className="text-xs font-normal text-white ml-0.5 align-super">™</span>
                </div>
                <div className="text-sm text-gray-300">Control Your Privacy</div>
                <div className="text-xs text-gray-400">by ERMITS</div>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering individuals to take control of their digital privacy and protect their personal data.
            </p>
          </div>

          {/* Column 2: Empty - for spacing */}
          <div aria-hidden="true"></div>

          {/* Column 3: Learn */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-accent">Learn</h2>
            <ul className="space-y-1.5">
              <li>
                <Link to="/resources/guides" className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <BookOpen className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/resources/checklists" className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <ClipboardList className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Checklists
                </Link>
              </li>
              <li>
                <Link to="/privacy-laws" className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <Scale className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Privacy Laws
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <Globe className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-accent">Company</h2>
            <ul className="space-y-1.5">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <Info className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <HelpCircle className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <Users className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <Mail className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-accent">Legal</h2>
            <ul className="space-y-1.5">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <ScaleIcon className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <Cookie className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/acceptable-use" className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <FileText className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Acceptable Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-3 mt-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs mb-2 md:mb-0">
              © {currentYear} ERMITS LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;