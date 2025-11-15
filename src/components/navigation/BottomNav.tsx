import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, BookOpen, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const defaultNavItems: NavItem[] = [
  {
    path: '/',
    label: 'Home',
    icon: Home
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    path: '/resources',
    label: 'Resources',
    icon: BookOpen
  },
  {
    path: '/dashboard/settings',
    label: 'Settings',
    icon: Settings
  },
  {
    path: '/dashboard/profile',
    label: 'Profile',
    icon: User
  }
];

interface BottomNavProps {
  items?: NavItem[];
  className?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({
  items = defaultNavItems,
  className = ''
}) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0
        bg-card dark:bg-card
        border-t border-border dark:border-border
        md:hidden z-40
        safe-area-inset-bottom
        ${className}
      `}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5 gap-1 px-2 py-2 pb-safe">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                  flex flex-col items-center justify-center
                  py-2 px-1 rounded-lg
                  transition-all duration-200
                  active:scale-95
                  ${isActive || active
                    ? 'text-accent'
                    : 'text-text-secondary dark:text-text-secondary hover:text-text dark:hover:text-text'
                  }
                `
              }
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              {({ isActive: linkActive }) => (
                <>
                  <div className="relative">
                    <Icon className="h-6 w-6 mb-1" />
                    {(linkActive || active) && (
                      <motion.div
                        layoutId="bottomNavIndicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                  </div>
                  <span className="text-xs font-medium truncate max-w-full">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

// Hook to check if bottom nav should be shown
export const useBottomNav = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};
