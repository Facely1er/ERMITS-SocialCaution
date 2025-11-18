import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Search, BookOpen, CreditCard, MessageSquare,
  LayoutDashboard, LogOut, Gauge, HelpCircle, Wrench, FileText, ChevronDown,
  Users, Compass, Map as MapIcon, Shield, User, LucideIcon
} from 'lucide-react';
import Logo from '../common/Logo';
import useStore from '../../store/useStore';
import AuthModal from '../auth/AuthModal';
import Button from '../common/Button';
import ThemeSwitcher from '../ThemeSwitcher';
import SearchIcon from '../navigation/SearchIcon';
import MobileNav from '../navigation/MobileNav';

// Type definition for navigation items
interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  highlight?: boolean;
}

// Reorganized dropdown structure
const DropdownGroup = ({ label, icon: LabelIcon, items }: any) => {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  
  // Adjust dropdown position to prevent viewport overflow
  useEffect(() => {
    const updatePosition = () => {
      if (open && dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const menuWidth = 224; // w-56 = 14rem = 224px
        const viewportWidth = window.innerWidth;
        const spaceOnRight = viewportWidth - rect.right;
        
        const style: React.CSSProperties = {
          position: 'absolute',
          zIndex: 1100,
          minWidth: '14rem',
        };
        
        // If dropdown would overflow on the right, align to the right edge of button
        if (spaceOnRight < menuWidth && rect.left >= menuWidth) {
          style.right = 0;
          style.left = 'auto';
        } else {
          style.left = 0;
          style.right = 'auto';
        }
        
        setDropdownStyle(style);
      }
    };
    
    if (open) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [open]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);
  
  return (
    <div
      className="relative dropdown-container"
      ref={dropdownRef}
      style={{ overflow: 'visible' }}
    >
      <button 
        className="flex items-center gap-1.5 text-white hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200 group whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        type="button"
        {...(open ? { "aria-expanded": "true" } : { "aria-expanded": "false" })}
        aria-haspopup="true"
        aria-label={`${label} menu`}
      >
        {LabelIcon && <LabelIcon className="h-4 w-4 text-accent transition-colors duration-200 flex-shrink-0" />}
        <span className="text-sm">{label}</span>
        <ChevronDown className={`h-4 w-4 text-accent transition-all duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <nav
          ref={menuRef}
          className="dropdown-menu absolute top-full left-0 mt-1 w-56 z-[1100] rounded-md bg-card text-text shadow-xl border border-border"
          role="navigation"
          aria-label={`${label} submenu`}
          style={dropdownStyle}
        >
          {items.map(({ path, label, icon: Icon, highlight }: any) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `px-4 py-2 text-sm flex items-center gap-2 hover:bg-card-hover hover:text-accent transition-all duration-200 group first:rounded-t-md last:rounded-b-md ${
                  isActive ? 'font-semibold text-accent bg-accent/20 hover:bg-accent/30' : ''
                } ${highlight ? 'bg-accent/10 border-l-2 border-accent' : ''}`
              }
              onClick={() => setOpen(false)}
            >
              <Icon className="h-4 w-4 text-accent group-hover:text-accent transition-colors duration-200 flex-shrink-0" />
              {label}
              {highlight && (
                <span className="ml-auto text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
};

const Navbar: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const store = useStore();
  const { user } = store;

  const handleSignOut = () => {
    store.signOut();
    navigate('/');
  };

  // PRIMARY NAV ITEMS (always visible)
  const primaryNavItems: NavItem[] = [
    { path: '/personas', label: 'Personas', icon: Users },
    { path: '/assessment', label: 'Assessment', icon: Search },
    { path: '/features', label: 'Features', icon: Gauge },
    { path: '/toolkit', label: 'Toolkit', icon: Wrench },
  ];

  // My Privacy Roadmap dropdown
  const privacyRoadmapItems = [
    { path: '/30-day-roadmap', label: '30-Day Roadmap', icon: MapIcon },
    { path: '/privacy-journey', label: 'Privacy Journey', icon: Compass },
    { path: '/privacy-action-center', label: 'Action Center', icon: Shield },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];
  
  // Resources dropdown
  const resourcesItems = [
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/blog', label: 'Blog', icon: FileText },
    { path: '/help', label: 'Help', icon: HelpCircle },
    { path: '/contact', label: 'Contact', icon: MessageSquare },
  ];

  return (
    <header className="nav-header bg-primary fixed top-0 w-full z-50">
      <div className="container mx-auto px-6">
        <div className="header-grid">
          {/* Left Section: Logo and Branding */}
          <div className="header-left">
            <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
              <Logo size={40} light />
              <div className="flex flex-col justify-center leading-none whitespace-nowrap">
                <div className="flex items-baseline">
                  <span className="text-base font-bold text-white">SocialCaution</span>
                  <span className="text-[10px] font-normal text-white ml-0.5 align-super">™</span>
                </div>
                <div className="text-[10px] text-gray-300 leading-none -mt-0.5">Control Your Privacy</div>
                <div className="text-[10px] text-gray-400 leading-none -mt-0.5">by ERMITS</div>
              </div>
            </Link>
          </div>

          {/* Center Section: Desktop Navigation */}
          <nav className="header-center hidden md:flex items-center justify-center">
            {/* Home Link */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-white hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-all duration-200 group whitespace-nowrap ${
                  isActive ? 'text-accent bg-accent/20 hover:bg-accent/30 font-semibold' : ''
                }`
              }
            >
              <Home className="h-4 w-4 text-accent transition-colors duration-200 flex-shrink-0" />
              <span className="text-sm">Home</span>
            </NavLink>

            {/* PRIMARY NAV ITEMS (always visible) */}
            {primaryNavItems.map(({ path, label, icon: Icon, highlight }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                `flex items-center gap-1.5 text-white hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-all duration-200 group whitespace-nowrap ${
                  isActive ? 'text-accent bg-accent/20 hover:bg-accent/30 font-semibold' : ''
                } ${highlight ? 'bg-accent/10 border border-accent/30' : ''}`
                }
              >
                <Icon className="h-4 w-4 text-accent transition-colors duration-200 flex-shrink-0" />
                <span className="text-sm">{label}</span>
              </NavLink>
            ))}

            {/* DROPDOWN: "Roadmap" */}
            <DropdownGroup label="Roadmap" icon={Compass} items={privacyRoadmapItems} />

            {/* DROPDOWN: "Resources" */}
            <DropdownGroup label="Resources" icon={BookOpen} items={resourcesItems} />
          </nav>

          {/* Right Section: Search and Action Buttons */}
          <div className="header-right hidden md:flex items-center">
            {/* Pricing Link */}
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-white hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-all duration-200 group whitespace-nowrap ${
                  isActive ? 'text-accent bg-accent/20 hover:bg-accent/30 font-semibold' : ''
                }`
              }
            >
              <CreditCard className="h-4 w-4 text-accent transition-colors duration-200 flex-shrink-0" />
              <span className="text-sm">Pricing</span>
            </NavLink>
            
            {/* Search Icon */}
            <SearchIcon />

            <ThemeSwitcher />
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  aria-label="Dashboard"
                  title="Dashboard"
                  className="flex items-center justify-center text-white hover:text-white hover:bg-white/10 p-2 rounded-md transition-all duration-200 group"
                >
                  <LayoutDashboard className="h-5 w-5 text-accent transition-colors duration-200" />
                </NavLink>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  aria-label="Sign Out"
                  title="Sign Out"
                  className="flex items-center gap-1.5 text-white border-white hover:bg-white/10 transition-all duration-200 group px-3 py-1.5 text-sm"
                >
                  <LogOut className="h-4 w-4 text-accent transition-colors duration-200" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <NavLink
                  to="/dashboard"
                  aria-label="Dashboard"
                  title="Dashboard"
                  className="flex items-center justify-center text-white hover:text-white hover:bg-white/10 p-2 rounded-md transition-all duration-200 group"
                >
                  <LayoutDashboard className="h-5 w-5 text-accent transition-colors duration-200" />
                </NavLink>
                <Button
                  variant="outline"
                  onClick={() => setShowAuth(true)}
                  aria-label="Account"
                  title="Account"
                  className="flex items-center justify-center text-white border-white hover:bg-white/10 transition-all duration-200 p-2"
                >
                  <User className="h-5 w-5 text-accent transition-colors duration-200" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultMode="signin" />}
    </header>
  );
};

export default Navbar;