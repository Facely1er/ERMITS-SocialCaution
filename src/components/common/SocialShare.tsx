import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from 'lucide-react';
import { useProgressStore } from '../../store/progressStore';

interface SocialShareProps {
  type: 'assessment' | 'achievement' | 'progress' | 'action';
  data: {
    title: string;
    description: string;
    score?: number;
    level?: number;
    points?: number;
    achievement?: string;
  };
  className?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ type, data, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { shareContent } = useProgressStore();

  const generateShareText = () => {
    const baseUrl = window.location.origin;
    
    switch (type) {
      case 'assessment':
        return `I just completed my privacy assessment and scored ${data.score}%! Check out Social Caution to improve your digital privacy: ${baseUrl}`;
      case 'achievement':
        return `I just unlocked the "${data.achievement}" achievement on Social Caution! Level ${data.level} and ${data.points} points. Join me in improving digital privacy: ${baseUrl}`;
      case 'progress':
        return `I'm level ${data.level} on Social Caution with ${data.points} points! Taking control of my digital privacy one step at a time. Join me: ${baseUrl}`;
      case 'action':
        return `Just completed "${data.title}" on my privacy action plan! Every small step counts towards better digital security. Check out Social Caution: ${baseUrl}`;
      default:
        return `Check out Social Caution - the platform for improving your digital privacy: ${baseUrl}`;
    }
  };

  const shareText = generateShareText();
  const encodedText = encodeURIComponent(shareText);
  const baseUrl = window.location.origin;

  const shareOptions = [
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedText}`,
      color: 'hover:bg-blue-50 hover:text-blue-600'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl)}&quote=${encodedText}`,
      color: 'hover:bg-blue-50 hover:text-blue-600'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseUrl)}&summary=${encodedText}`,
      color: 'hover:bg-blue-50 hover:text-blue-600'
    }
  ];

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
    shareContent();
    setIsOpen(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      shareContent();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </motion.button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-20"
          >
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Share your progress</h4>
              
              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">{shareText}</p>
              </div>

              {/* Share Options */}
              <div className="space-y-2">
                {shareOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleShare(option.url)}
                      className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${option.color}`}
                      whileHover={{ x: 4 }}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">Share on {option.name}</span>
                    </motion.button>
                  );
                })}

                {/* Copy Link */}
                <motion.button
                  onClick={handleCopy}
                  className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${
                    copied ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  <span className="font-medium">
                    {copied ? 'Copied to clipboard!' : 'Copy text'}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default SocialShare;