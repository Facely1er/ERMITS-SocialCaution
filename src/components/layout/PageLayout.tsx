import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ArrowLeft } from 'lucide-react';
import { designSystem } from '../../styles/design-system';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentPersona?: {
    displayName: string;
    icon: string;
  } | null;
  showPersonaButton?: boolean;
  showBackButton?: boolean;
  actions?: ReactNode;
  variant?: 'default' | 'centered';
}

export default function PageLayout({
  children,
  title,
  subtitle,
  currentPersona,
  showPersonaButton = false,
  showBackButton = false,
  actions,
  variant = 'centered',
}: PageLayoutProps) {
  const navigate = useNavigate();

  if (variant === 'centered') {
    return (
      <div className={`min-h-screen ${designSystem.gradients.page} ${designSystem.spacing.page} ${designSystem.container.padding}`}>
        <div className={`${designSystem.container.maxWidth} mx-auto`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${designSystem.gradients.page}`}>
      {/* Header */}
      <div className={`${designSystem.gradients.header} text-white relative z-10`}>
        <div className={`${designSystem.container.maxWidth} mx-auto ${designSystem.container.padding} py-6 md:py-8`}>
          {/* Mobile-optimized layout */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 w-full sm:w-auto">
              {showBackButton && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-white/80 hover:text-white mb-3 transition-colors focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none rounded-lg px-2 py-1"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Back</span>
                </button>
              )}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-indigo-100 text-base sm:text-lg leading-relaxed">{subtitle}</p>
              )}
              {currentPersona && !subtitle && (
                <p className="text-indigo-100 mt-2 text-sm sm:text-base">
                  Tailored for: <span className="font-semibold">{currentPersona.displayName}</span>{' '}
                  {currentPersona.icon}
                </p>
              )}
            </div>

            {/* Action buttons - stack on mobile, row on desktop */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              {showPersonaButton && (
                <button
                  onClick={() => navigate('/persona-selection')}
                  className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors text-sm sm:text-base backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none flex items-center justify-center gap-2"
                  aria-label="Change your persona"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Change Persona</span>
                  <span className="sm:hidden">Change</span>
                </button>
              )}
              {actions}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${designSystem.container.maxWidth} mx-auto ${designSystem.container.padding} ${designSystem.spacing.page}`}>
        {children}
      </div>
    </div>
  );
}
