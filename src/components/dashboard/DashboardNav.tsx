import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  ListTodo, 
  History, 
  BookOpen, 
  Search, 
  FileCheck, 
  ClipboardCheck, 
  User, 
  Settings, 
  HelpCircle, 
  PenTool as Tool, 
  Scale,
  Bell,
  Database,
  LogOut,
  LogIn
} from 'lucide-react';
import useStore from '../../store/useStore';
import { useAuth } from '../auth/AuthContext';

const DashboardNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useStore();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      if (user) {
        await logout();
      }
      if (store.signOut) {
        store.signOut();
      }
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      navigate('/');
    }
  };

  const handleSignIn = () => {
    navigate('/dashboard/profile');
  };

  const navItems = [
    {
      label: 'Overview',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: ListTodo, label: 'Action Plan', path: '/dashboard/action-plan' },
        { icon: History, label: 'History', path: '/dashboard/history' }
      ]
    },
    {
      label: 'Privacy Tools',
      items: [
        { icon: Search, label: 'Exposure Check', path: '/dashboard/exposure-check' },
        { icon: FileCheck, label: 'Rights Checkup', path: '/dashboard/rights-checkup' },
        { icon: ClipboardCheck, label: 'Privacy Assessment', path: '/dashboard/complete-assessment' },
        { icon: Database, label: 'Data Inventory', path: '/resources/tools/personal-data-inventory' }
      ]
    },
    {
      label: 'Resources',
      items: [
        { icon: BookOpen, label: 'Privacy Guides', path: '/resources/guides' },
        { icon: ClipboardList, label: 'Privacy Checklists', path: '/resources/checklists' },
        { icon: Tool, label: 'Privacy Tools', path: '/resources/tools' },
        { icon: Scale, label: 'Privacy Laws', path: '/privacy-laws' }
      ]
    },
    {
      label: 'Settings',
      items: [
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
        { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
        { icon: HelpCircle, label: 'Help', path: '/dashboard/help' }
      ]
    }
  ];

  return (
    <nav className="w-full h-full bg-transparent flex flex-col">
      <div className="px-3 space-y-6 py-4 flex-1 overflow-y-auto pb-6">
        {navItems.map((section, index) => (
          <div key={index}>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
              {section.label}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-2 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'bg-accent/20 text-accent hover:bg-accent/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-card-hover hover:text-accent'
                    }`}
                  >
                    <item.icon className={`h-4 w-4 mr-2.5 ${
                      isActive(item.path) ? 'text-accent' : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {/* Auth Button - Sign In or Sign Out */}
      <div className="px-3 py-4 border-t border-border dark:border-border">
        {user ? (
          <button
            onClick={handleSignOut}
            className="flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-card-hover hover:text-red-600 dark:hover:text-red-400 rounded-md transition-colors w-full"
          >
            <LogOut className="h-4 w-4 mr-2.5 text-gray-400 dark:text-gray-500" />
            Sign Out
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="flex items-center px-2 py-1.5 text-sm font-medium text-accent hover:bg-accent/10 rounded-md transition-colors w-full"
          >
            <LogIn className="h-4 w-4 mr-2.5 text-accent" />
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default DashboardNav;