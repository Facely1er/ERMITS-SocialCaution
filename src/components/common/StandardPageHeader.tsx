import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Database, Globe, Lock, DollarSign, Users, BookOpen, FileText, AlertTriangle, CheckCircle, 
  Clipboard, BarChart, TrendingUp, Heart, UserCircle, Wrench, Settings, Search, Scan, 
  Mail, MessageCircle, Phone, MapPin, Info, Target, Award, Sparkles, Zap, Star, 
  HelpCircle, Lightbulb, MessageSquare, Scale, Gavel, LucideIcon 
} from 'lucide-react';
import PageHero from './PageHero';
import AnimatedBackground from './AnimatedBackground';
import Breadcrumb from './Breadcrumb';
// import Icon from './Icon';

interface FloatingElement {
  icon: LucideIcon;
  text: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  delay?: number;
  duration?: number;
}

interface StandardPageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  showBreadcrumbs?: boolean;
  heroType?: 'standard' | 'animated' | 'minimal';
  heroBackground?: boolean;
  backgroundType?: 'particles' | 'matrix' | 'network' | 'privacy' | 'pricing' | 'resources' | 'toolkit' | 'blog' | 
                   'assessment' | 'personas' | 'tools' | 'contact' | 'about' | 'features' | 'help' | 'legal';
  backgroundImage?: string; // URL to background image
  backgroundImageOpacity?: number; // 0-1, default 0.15
  floatingElements?: FloatingElement[];
  children?: ReactNode;
  className?: string;
}

const StandardPageHeader: React.FC<StandardPageHeaderProps> = ({
  title,
  subtitle,
  description,
  breadcrumbs = [],
  showBreadcrumbs = true,
  heroType = 'minimal',
  heroBackground = true,
  backgroundType = 'particles',
  backgroundImage,
  backgroundImageOpacity = 0.15,
  floatingElements = [],
  children,
  className = ''
}) => {
  // For minimal hero type, we'll use a simpler header without hero background
  if (heroType === 'minimal') {
    return (
      <div className={`relative ${className}`}>
        {/* Breadcrumbs */}
        {showBreadcrumbs && breadcrumbs.length > 0 && (
          <div className="bg-background-secondary dark:bg-background-secondary py-2 md:py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4">
              <Breadcrumb items={breadcrumbs} />
            </div>
          </div>
        )}
        
        {/* Simple Header Section */}
        <div className="bg-white dark:bg-background py-8 md:py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <motion.h1 
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary dark:text-white mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {title}
              </motion.h1>
              
              {subtitle && (
                <motion.p 
                  className="text-base md:text-lg text-text-secondary dark:text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {subtitle}
                </motion.p>
              )}
              
              {description && (
                <motion.p 
                  className="text-sm md:text-base text-text-secondary dark:text-gray-400 mt-2 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {description}
                </motion.p>
              )}
              
              {children && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-4"
                >
                  {children}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getHeroType = () => {
    switch (heroType) {
      case 'animated':
        return 'animated';
      case 'standard':
        return 'gradient';
      default:
        return 'gradient';
    }
  };

  const getDefaultFloatingElements = (): FloatingElement[] => {
    if (floatingElements.length > 0) return floatingElements;
    
    // Default floating elements based on background type
    const defaults: Record<string, FloatingElement[]> = {
      privacy: [
        { icon: Shield, text: "Privacy Protection", position: { top: "15%", left: "10%" }, delay: 0, duration: 2 },
        { icon: Database, text: "Data Security", position: { top: "20%", right: "15%" }, delay: 0.3, duration: 2.3 },
        { icon: Globe, text: "Online Privacy", position: { bottom: "20%", left: "15%" }, delay: 0.5, duration: 2.5 },
        { icon: Lock, text: "Privacy Rights", position: { bottom: "15%", right: "10%" }, delay: 0.7, duration: 1.8 }
      ],
      pricing: [
        { icon: DollarSign, text: "Affordable Plans", position: { top: "10%", left: "5%" }, delay: 0, duration: 2 },
        { icon: CheckCircle, text: "Save 20%", position: { top: "15%", right: "5%" }, delay: 0.3, duration: 2.3 },
        { icon: Shield, text: "Premium Features", position: { bottom: "15%", left: "5%" }, delay: 0.5, duration: 2.5 },
        { icon: Users, text: "Family Protection", position: { bottom: "10%", right: "5%" }, delay: 0.7, duration: 1.8 }
      ],
      resources: [
        { icon: BookOpen, text: "External Guides", position: { top: "25%", left: "3%" }, delay: 0, duration: 2 },
        { icon: Users, text: "Privacy Organizations", position: { top: "30%", right: "3%" }, delay: 0.3, duration: 2.3 },
        { icon: FileText, text: "Research Papers", position: { bottom: "30%", left: "3%" }, delay: 0.5, duration: 2.5 },
        { icon: Shield, text: "Privacy Tools", position: { bottom: "25%", right: "3%" }, delay: 0.7, duration: 1.8 }
      ],
      toolkit: [
        { icon: Shield, text: "Privacy Tools", position: { top: "15%", left: "10%" }, delay: 0, duration: 2 },
        { icon: BookOpen, text: "Privacy Guides", position: { top: "20%", right: "15%" }, delay: 0.3, duration: 2.3 },
        { icon: FileText, text: "Privacy Checklists", position: { bottom: "20%", left: "15%" }, delay: 0.5, duration: 2.5 },
        { icon: Lock, text: "Privacy Protection", position: { bottom: "15%", right: "10%" }, delay: 0.7, duration: 1.8 }
      ],
      blog: [
        { icon: FileText, text: "Privacy Articles", position: { top: "15%", left: "10%" }, delay: 0, duration: 2 },
        { icon: Globe, text: "Privacy Topics", position: { top: "20%", right: "15%" }, delay: 0.3, duration: 2.3 },
        { icon: AlertTriangle, text: "Latest Updates", position: { bottom: "20%", left: "15%" }, delay: 0.5, duration: 2.5 }
      ],
      assessment: [
        { icon: Clipboard, text: "Privacy Assessment", position: { top: "15%", left: "10%" }, delay: 0, duration: 2 },
        { icon: BarChart, text: "Risk Analysis", position: { top: "20%", right: "15%" }, delay: 0.3, duration: 2.3 },
        { icon: Shield, text: "Security Check", position: { bottom: "20%", left: "15%" }, delay: 0.5, duration: 2.5 },
        { icon: TrendingUp, text: "Improve Privacy", position: { bottom: "15%", right: "10%" }, delay: 0.7, duration: 1.8 }
      ],
      personas: [
        { icon: Users, text: "Your Persona", position: { top: "15%", left: "10%" }, delay: 0, duration: 2 },
        { icon: Heart, text: "Personalized", position: { top: "20%", right: "15%" }, delay: 0.3, duration: 2.3 },
        { icon: Shield, text: "Privacy Focus", position: { bottom: "20%", left: "15%" }, delay: 0.5, duration: 2.5 },
        { icon: UserCircle, text: "Your Profile", position: { bottom: "15%", right: "10%" }, delay: 0.7, duration: 1.8 }
      ],
      tools: [
        { icon: Wrench, text: "Privacy Tools", position: { top: "15%", left: "10%" }, delay: 0, duration: 2 },
        { icon: Search, text: "Scan & Analyze", position: { top: "20%", right: "15%" }, delay: 0.3, duration: 2.3 },
        { icon: Settings, text: "Customize", position: { bottom: "20%", left: "15%" }, delay: 0.5, duration: 2.5 },
        { icon: Scan, text: "Quick Scan", position: { bottom: "15%", right: "10%" }, delay: 0.7, duration: 1.8 }
      ],
      contact: [
        { icon: Mail, text: "Get in Touch", position: { top: "15%", left: "10%" }, delay: 0, duration: 2 },
        { icon: MessageCircle, text: "Support", position: { top: "20%", right: "15%" }, delay: 0.3, duration: 2.3 },
        { icon: Phone, text: "Contact Us", position: { bottom: "20%", left: "15%" }, delay: 0.5, duration: 2.5 },
        { icon: MapPin, text: "Find Us", position: { bottom: "15%", right: "10%" }, delay: 0.7, duration: 1.8 }
      ],
      about: [
        { icon: Info, text: "Our Mission", position: { top: "15%", left: "10%" }, delay: 0, duration: 2 },
        { icon: Users, text: "Our Team", position: { top: "20%", right: "15%" }, delay: 0.3, duration: 2.3 },
        { icon: Target, text: "Our Goals", position: { bottom: "20%", left: "15%" }, delay: 0.5, duration: 2.5 },
        { icon: Award, text: "Our Values", position: { bottom: "15%", right: "10%" }, delay: 0.7, duration: 1.8 }
      ],
      features: [
        { icon: Sparkles, text: "Key Features", position: { top: "15%", left: "10%" }, delay: 0, duration: 2 },
        { icon: Zap, text: "Fast & Secure", position: { top: "20%", right: "15%" }, delay: 0.3, duration: 2.3 },
        { icon: Star, text: "Premium", position: { bottom: "20%", left: "15%" }, delay: 0.5, duration: 2.5 },
        { icon: CheckCircle, text: "Verified", position: { bottom: "15%", right: "10%" }, delay: 0.7, duration: 1.8 }
      ],
      help: [
        { icon: HelpCircle, text: "FAQ", position: { top: "15%", left: "10%" }, delay: 0, duration: 2 },
        { icon: BookOpen, text: "Guides", position: { top: "20%", right: "15%" }, delay: 0.3, duration: 2.3 },
        { icon: Lightbulb, text: "Tips", position: { bottom: "20%", left: "15%" }, delay: 0.5, duration: 2.5 },
        { icon: MessageSquare, text: "Support", position: { bottom: "15%", right: "10%" }, delay: 0.7, duration: 1.8 }
      ],
      legal: [
        { icon: Scale, text: "Legal", position: { top: "15%", left: "10%" }, delay: 0, duration: 2 },
        { icon: FileText, text: "Policies", position: { top: "20%", right: "15%" }, delay: 0.3, duration: 2.3 },
        { icon: Shield, text: "Your Rights", position: { bottom: "20%", left: "15%" }, delay: 0.5, duration: 2.5 },
        { icon: Gavel, text: "Compliance", position: { bottom: "15%", right: "10%" }, delay: 0.7, duration: 1.8 }
      ]
    };
    
    return defaults[backgroundType] || defaults.privacy;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Breadcrumbs */}
      {showBreadcrumbs && breadcrumbs.length > 0 && (
        <div className="bg-background-secondary dark:bg-background-secondary py-2 md:py-3">
          <div className="container mx-auto px-4">
            <Breadcrumb items={breadcrumbs} />
          </div>
        </div>
      )}
      
      {/* Hero Section - only render if heroBackground is true */}
      {heroBackground ? (
        <PageHero
          title={title}
          subtitle={subtitle}
          description={description}
          backgroundType={getHeroType()}
          backgroundImage={backgroundImage}
          backgroundImageOpacity={backgroundImageOpacity}
          floatingElements={getDefaultFloatingElements()}
        >
          {children}
        </PageHero>
      ) : (
        /* Simple page header when heroBackground is false */
        <div className="bg-background dark:bg-background py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-white mb-4 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-lg md:text-xl lg:text-2xl text-text-secondary dark:text-gray-300 mb-4 leading-relaxed">
                  {subtitle}
                </p>
              )}
              {description && (
                <p className="text-base md:text-lg text-text-secondary dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  {description}
                </p>
              )}
              {children}
            </div>
          </div>
        </div>
      )}
      
      {/* Animated Background for animated hero type */}
      {heroBackground && heroType === 'animated' && (
        <AnimatedBackground
          type={backgroundType}
          className="absolute inset-0 w-full h-full z-0"
        />
      )}
    </div>
  );
};

export default StandardPageHeader;