import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Settings, Eye, Volume2, Type, MousePointer } from 'lucide-react';
import Card from './Card';
import { 
  getAccessibilityPreferences, 
  saveAccessibilityPreferences, 
  announceToScreenReader,
  AccessibilityOptions 
} from '../../utils/accessibility';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState<AccessibilityOptions>({
    announceChanges: true,
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    screenReader: false
  });

  useEffect(() => {
    if (isOpen) {
      setPreferences(getAccessibilityPreferences());
    }
  }, [isOpen]);

  const updatePreference = (key: keyof AccessibilityOptions, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    saveAccessibilityPreferences(newPreferences);
    
    if (preferences.announceChanges) {
      announceToScreenReader(`Accessibility setting updated: ${key}`);
    }
  };

  const applyAccessibilityStyles = useCallback(() => {
    const root = document.documentElement;
    
    // High contrast mode
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (preferences.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Font size
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${preferences.fontSize}`);
  }, [preferences]);

  useEffect(() => {
    applyAccessibilityStyles();
  }, [preferences, applyAccessibilityStyles]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="accessibility-settings-title"
        aria-modal="true"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 id="accessibility-settings-title" className="text-2xl font-bold">
              Accessibility Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close accessibility settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Visual Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Visual Settings
              </h3>
              
              <div className="space-y-4">
                {/* High Contrast */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">High Contrast Mode</h4>
                    <p className="text-sm text-gray-600">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="high-contrast"
                      name="high-contrast"
                      checked={preferences.highContrast}
                      onChange={(e) => updatePreference('highContrast', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      preferences.highContrast ? 'bg-primary' : 'bg-gray-200'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        preferences.highContrast ? 'translate-x-5' : 'translate-x-0.5'
                      } mt-0.5`} />
                    </div>
                  </label>
                </div>

                {/* Font Size */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Font Size</h4>
                  <div className="flex gap-2">
                    {[
                      { value: 'small', label: 'Small', icon: Type },
                      { value: 'medium', label: 'Medium', icon: Type },
                      { value: 'large', label: 'Large', icon: Type }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => updatePreference('fontSize', value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                          preferences.fontSize === value
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Motion Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MousePointer className="w-5 h-5" />
                Motion Settings
              </h3>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Reduce Motion</h4>
                    <p className="text-sm text-gray-600">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="reduced-motion"
                      name="reduced-motion"
                      checked={preferences.reducedMotion}
                      onChange={(e) => updatePreference('reducedMotion', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      preferences.reducedMotion ? 'bg-primary' : 'bg-gray-200'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        preferences.reducedMotion ? 'translate-x-5' : 'translate-x-0.5'
                      } mt-0.5`} />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Audio Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Audio Settings
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Screen Reader Announcements</h4>
                      <p className="text-sm text-gray-600">
                        Announce changes to screen readers
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="announce-changes"
                        name="announce-changes"
                        checked={preferences.announceChanges}
                        onChange={(e) => updatePreference('announceChanges', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors ${
                        preferences.announceChanges ? 'bg-primary' : 'bg-gray-200'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          preferences.announceChanges ? 'translate-x-5' : 'translate-x-0.5'
                        } mt-0.5`} />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Open accessibility settings</span>
                    <kbd className="px-2 py-1 bg-white border rounded">Alt + A</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Skip to main content</span>
                    <kbd className="px-2 py-1 bg-white border rounded">Alt + M</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Toggle high contrast</span>
                    <kbd className="px-2 py-1 bg-white border rounded">Alt + H</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Increase font size</span>
                    <kbd className="px-2 py-1 bg-white border rounded">Ctrl + +</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Decrease font size</span>
                    <kbd className="px-2 py-1 bg-white border rounded">Ctrl + -</kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  const defaultPrefs = getAccessibilityPreferences();
                  setPreferences(defaultPrefs);
                  saveAccessibilityPreferences(defaultPrefs);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AccessibilitySettings;