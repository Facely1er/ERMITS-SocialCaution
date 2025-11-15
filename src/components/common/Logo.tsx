import React from 'react';

interface LogoProps {
  size?: number;
  showTagline?: boolean;
  light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 62.4, showTagline = false, light = false }) => {
  return (
    <div className="flex items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Use socialcaution.png logo from public folder */}
        <img 
          src="/socialcaution.png" 
          alt="SocialCaution Logo" 
          width={size} 
          height={size}
          style={{ 
            width: size, 
            height: size,
            objectFit: 'contain',
            display: 'block'
          }}
          onError={(e) => {
            // Fallback to favicon if logo fails to load
            const target = e.target as HTMLImageElement;
            target.src = '/favicon.svg';
          }}
        />
      </div>
      
      {showTagline && (
        <div className="ml-3">
          <div
            className="text-sm"
            style={{ color: light ? '#FFFFFF' : '#666666' }}
          >
            Your Privacy Journey Starts Here
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;