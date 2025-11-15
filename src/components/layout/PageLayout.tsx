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
      <div className={`${designSystem.gradients.header} text-white`}>
        <div className={`${designSystem.container.maxWidth} mx-auto ${designSystem.container.padding} ${designSystem.spacing.page}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {showBackButton && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Back</span>
                </button>
              )}
              <h1 className={`${designSystem.typography.h1} text-white mb-2`}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-indigo-100 text-lg">{subtitle}</p>
              )}
              {currentPersona && (
                <p className="text-indigo-100 mt-2">
                  {subtitle ? 'Persona: ' : 'Tailored for: '}
                  <span className="font-semibold">{currentPersona.displayName}</span>{' '}
                  {currentPersona.icon}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              {showPersonaButton && (
                <button
                  onClick={() => navigate('/persona-selection')}
                  className={designSystem.buttons.secondary}
                >
                  <Settings className="h-4 w-4 inline mr-2" />
                  Change Persona
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
