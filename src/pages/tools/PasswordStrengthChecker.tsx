import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, AlertTriangle, Shield, History, Trash2, Copy, Check, FileDown } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { exportPasswordCheckToPDF } from '../../utils/toolsExport';

interface PasswordStrengthAnalysis {
  score: number;
  strength: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
  requirements: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    special: boolean;
  };
  estimatedCrackTime: string;
}

interface PasswordCheck {
  id: string;
  password: string; // Store masked version for history
  strength: 'weak' | 'fair' | 'good' | 'strong';
  score: number;
  checkedAt: string;
}

const PasswordStrengthChecker: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordStrengthAnalysis | null>(null);
  const [checkHistory, setCheckHistory] = useState<PasswordCheck[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem('passwordCheckHistory');
        if (stored) {
          const parsed = JSON.parse(stored);
          setCheckHistory(parsed);
        }
      } catch (error) {
        console.error('Error loading password check history:', error);
      }
    };
    loadHistory();
  }, []);

  // Analyze password strength (client-side only)
  const analyzePasswordStrength = (pwd: string): PasswordStrengthAnalysis => {
    let score = 0;
    const feedback: string[] = [];

    // Length checks
    if (pwd.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');

    if (pwd.length >= 12) score += 1;
    else if (pwd.length >= 8) feedback.push('Consider using 12+ characters for better security');

    if (pwd.length >= 16) score += 1;

    // Character variety checks
    if (/[a-z]/.test(pwd)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(pwd)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/[0-9]/.test(pwd)) score += 1;
    else feedback.push('Include numbers');

    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    else feedback.push('Include special characters (!@#$%^&*)');

    // Common patterns check
    if (/(.)\1{2,}/.test(pwd)) {
      score -= 1;
      feedback.push('Avoid repeating characters (e.g., "aaa")');
    }

    if (/123|abc|qwe|asd|zxc|password|admin/i.test(pwd)) {
      score -= 1;
      feedback.push('Avoid common patterns and dictionary words');
    }

    // Entropy calculation for crack time estimation
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    
    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasNumbers) charsetSize += 10;
    if (hasSpecial) charsetSize += 32; // Common special chars

    const entropy = pwd.length * Math.log2(charsetSize || 1);
    const estimatedCrackTime = estimateCrackTime(entropy);

    // Determine strength level
    let strength: 'weak' | 'fair' | 'good' | 'strong';
    const finalScore = Math.max(0, Math.min(100, score * 15));
    
    if (finalScore < 40) strength = 'weak';
    else if (finalScore < 60) strength = 'fair';
    else if (finalScore < 80) strength = 'good';
    else strength = 'strong';

    return {
      score: finalScore,
      strength,
      feedback: feedback.length > 0 ? feedback : ['Great password!'],
      requirements: {
        length: pwd.length >= 8,
        lowercase: hasLower,
        uppercase: hasUpper,
        numbers: hasNumbers,
        special: hasSpecial
      },
      estimatedCrackTime
    };
  };

  const estimateCrackTime = (entropy: number): string => {
    // Rough estimation based on entropy
    // Assuming 10^9 guesses per second (modern GPU)
    const guesses = Math.pow(2, entropy);
    const seconds = guesses / 1e9;

    if (seconds < 1) return 'Instant';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;
    return 'Centuries';
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length > 0) {
      const result = analyzePasswordStrength(value);
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  };

  const saveToHistory = () => {
    if (!password || !analysis) return;

    const maskedPassword = '*'.repeat(password.length);
    const check: PasswordCheck = {
      id: Date.now().toString(),
      password: maskedPassword,
      strength: analysis.strength,
      score: analysis.score,
      checkedAt: new Date().toISOString()
    };

    const updated = [check, ...checkHistory].slice(0, 50); // Keep last 50
    setCheckHistory(updated);
    try {
      localStorage.setItem('passwordCheckHistory', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const deleteFromHistory = (id: string) => {
    const updated = checkHistory.filter(c => c.id !== id);
    setCheckHistory(updated);
    try {
      localStorage.setItem('passwordCheckHistory', JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting from history:', error);
    }
  };

  const generateStrongPassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const all = lowercase + uppercase + numbers + special;

    let generated = '';
    // Ensure at least one of each type
    generated += lowercase[Math.floor(Math.random() * lowercase.length)];
    generated += uppercase[Math.floor(Math.random() * uppercase.length)];
    generated += numbers[Math.floor(Math.random() * numbers.length)];
    generated += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly
    for (let i = generated.length; i < 16; i++) {
      generated += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle the password
    const shuffled = generated.split('').sort(() => Math.random() - 0.5).join('');
    setPassword(shuffled);
    const result = analyzePasswordStrength(shuffled);
    setAnalysis(result);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-red-600 dark:text-red-400';
      case 'fair': return 'text-orange-600 dark:text-orange-400';
      case 'good': return 'text-yellow-600 dark:text-yellow-400';
      case 'strong': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStrengthBgColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'fair': return 'bg-orange-500';
      case 'good': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'weak': return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'fair': return <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case 'good': return <CheckCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'strong': return <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />;
      default: return <Lock className="h-5 w-5" />;
    }
  };

  return (
    <PageLayout
      title={'Password Strength Checker'}
      subtitle={'Check and improve your password security'}
      description={'Analyze your password strength and get recommendations to create stronger, more secure passwords.'}
      heroBackground={false}
      backgroundType="toolkit"
      breadcrumbs={[
        { label: 'Resources', path: '/resources' },
        { label: 'Tools', path: '/resources/tools' },
        { label: 'Password Checker', path: '/resources/tools/password-strength' }
      ]}
    >
      {/* Client-Side Tool Indicator */}
      <div className="mb-6">
        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">
                {'100% Client-Side Tool'}
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                {'Your password is analyzed entirely in your browser. It is never sent to any server. All checks are saved locally in your browser for your reference.'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Section>
        {showHistory ? (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text dark:text-white flex items-center">
                <History className="h-5 w-5 mr-2" />
                {'Check History'}
              </h3>
              <Button onClick={() => setShowHistory(false)} variant="outline" size="sm">
                {'Back to Checker'}
              </Button>
            </div>
            {checkHistory.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-text-secondary dark:text-gray-300">
                  {'No password checks yet. Check a password to see history here.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {checkHistory.map((check) => (
                  <div
                    key={check.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <code className="text-lg font-mono text-text dark:text-white">
                            {check.password}
                          </code>
                          <div className="flex items-center">
                            {getStrengthIcon(check.strength)}
                            <span className={`ml-1 text-sm font-medium ${getStrengthColor(check.strength)}`}>
                              {check.strength.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-text-secondary dark:text-gray-300">
                            Score: {check.score}/100
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary dark:text-gray-300">
                          {new Date(check.checkedAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => deleteFromHistory(check.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Password Input */}
            <Card className="p-6">
              <div className="mb-4">
                <label htmlFor="password-input" className="block text-sm font-medium text-text dark:text-white mb-2">
                  {'Enter Password to Check'}
                </label>
                <div className="relative">
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-24 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white font-mono"
                    autoComplete="off"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                    {password && (
                      <button
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                        title="Copy password"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={generateStrongPassword}
                  variant="outline"
                  size="sm"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {'Generate Strong Password'}
                </Button>
                {password && analysis && (
                  <Button
                    onClick={saveToHistory}
                    variant="outline"
                    size="sm"
                  >
                    <History className="h-4 w-4 mr-2" />
                    {'Save to History'}
                  </Button>
                )}
                {checkHistory.length > 0 && (
                  <Button
                    onClick={() => setShowHistory(true)}
                    variant="outline"
                    size="sm"
                  >
                    <History className="h-4 w-4 mr-2" />
                    {'View History'} ({checkHistory.length})
                  </Button>
                )}
              </div>
            </Card>

            {/* Strength Analysis */}
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-text dark:text-white flex items-center">
                      <Lock className="h-5 w-5 mr-2" />
                      {'Password Strength Analysis'}
                    </h3>
                    <div className="flex items-center space-x-3">
                      {getStrengthIcon(analysis.strength)}
                      <span className={`text-lg font-semibold ${getStrengthColor(analysis.strength)}`}>
                        {analysis.strength.toUpperCase()}
                      </span>
                      <Button
                        onClick={() => {
                          exportPasswordCheckToPDF({
                            password: password,
                            strength: analysis.strength,
                            score: analysis.score,
                            checkedAt: new Date().toISOString(),
                            requirements: analysis.requirements,
                            estimatedCrackTime: analysis.estimatedCrackTime,
                            feedback: analysis.feedback
                          });
                        }}
                        variant="outline"
                        size="sm"
                        className="ml-2"
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        {'Export PDF'}
                      </Button>
                    </div>
                  </div>

                  {/* Strength Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text dark:text-white">
                        {'Strength Score'}
                      </span>
                      <span className="text-sm font-bold text-text dark:text-white">
                        {analysis.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        className={`h-3 rounded-full ${getStrengthBgColor(analysis.strength)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.score}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Estimated Crack Time */}
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          {'Estimated Time to Crack'}
                        </p>
                        <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                          {analysis.estimatedCrackTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Requirements Checklist */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-text dark:text-white mb-4">
                      {'Password Requirements'}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        {analysis.requirements.length ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                        )}
                        <span className={analysis.requirements.length ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {'At least 8 characters'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {analysis.requirements.lowercase ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                        )}
                        <span className={analysis.requirements.lowercase ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {'Contains lowercase letters (a-z)'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {analysis.requirements.uppercase ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                        )}
                        <span className={analysis.requirements.uppercase ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {'Contains uppercase letters (A-Z)'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {analysis.requirements.numbers ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                        )}
                        <span className={analysis.requirements.numbers ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {'Contains numbers (0-9)'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {analysis.requirements.special ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                        )}
                        <span className={analysis.requirements.special ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {'Contains special characters (!@#$%^&*)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  {analysis.feedback.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-text dark:text-white mb-4">
                        {'Recommendations'}
                      </h4>
                      <div className="space-y-2">
                        {analysis.feedback.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-text-secondary dark:text-gray-300">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {/* Tips Card */}
            <Card className="p-6 bg-gradient-to-r from-accent/10 to-blue-500/10 border-accent/20">
              <h3 className="text-xl font-semibold text-text dark:text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                {'Password Security Tips'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                  <p className="text-text-secondary dark:text-gray-300">
                    {'Use a unique password for each account to prevent one breach from compromising multiple accounts'}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                  <p className="text-text-secondary dark:text-gray-300">
                    {'Consider using a password manager to generate and store strong, unique passwords'}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                  <p className="text-text-secondary dark:text-gray-300">
                    {'Enable two-factor authentication (2FA) whenever possible for additional security'}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                  <p className="text-text-secondary dark:text-gray-300">
                    {'Avoid using personal information like names, birthdays, or common words in your passwords'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Section>
    </PageLayout>
  );
};

export default PasswordStrengthChecker;

