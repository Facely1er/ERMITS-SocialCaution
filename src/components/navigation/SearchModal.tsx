import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Clock, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  type: 'page' | 'tool' | 'guide' | 'assessment' | 'persona';
  category: string;
  icon: React.ComponentType<any>;
  priority: number;
  keywords: string[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Search results data
  const searchData: SearchResult[] = useMemo(() => [
    // Main pages
    {
      id: 'home',
      title: 'Home',
      description: 'Main dashboard and overview',
      path: '/',
      type: 'page',
      category: 'Main',
      icon: Search,
      priority: 10,
      keywords: ['home', 'dashboard', 'main', 'overview']
    },
    {
      id: 'assessment',
      title: 'Privacy Assessment',
      description: 'Evaluate your privacy status',
      path: '/assessment',
      type: 'assessment',
      category: 'Tools',
      icon: Search,
      priority: 9,
      keywords: ['assessment', 'evaluation', 'privacy', 'check', 'test']
    },
    {
      id: 'personas',
      title: 'Privacy Personas',
      description: 'Find your privacy profile',
      path: '/personas',
      type: 'persona',
      category: 'Discovery',
      icon: Search,
      priority: 8,
      keywords: ['personas', 'profiles', 'types', 'categories', 'matching']
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Your privacy dashboard',
      path: '/dashboard',
      type: 'page',
      category: 'Account',
      icon: Search,
      priority: 7,
      keywords: ['dashboard', 'account', 'profile', 'personal']
    },
    {
      id: 'resources',
      title: 'Resources',
      description: 'Privacy guides and tools',
      path: '/resources',
      type: 'page',
      category: 'Learning',
      icon: Search,
      priority: 6,
      keywords: ['resources', 'guides', 'tools', 'help', 'learning']
    },
    // Assessment types
    {
      id: 'exposure-assessment',
      title: 'Exposure Assessment',
      description: 'Analyze your digital footprint',
      path: '/assessment/exposure',
      type: 'assessment',
      category: 'Assessments',
      icon: Search,
      priority: 8,
      keywords: ['exposure', 'digital footprint', 'online presence', 'risks']
    },
    {
      id: 'rights-assessment',
      title: 'Privacy Rights Assessment',
      description: 'Understand your privacy rights',
      path: '/assessment/rights',
      type: 'assessment',
      category: 'Assessments',
      icon: Search,
      priority: 8,
      keywords: ['rights', 'privacy rights', 'legal', 'compliance']
    },
    {
      id: 'security-assessment',
      title: 'Security Assessment',
      description: 'Comprehensive security evaluation',
      path: '/assessment/security',
      type: 'assessment',
      category: 'Assessments',
      icon: Search,
      priority: 8,
      keywords: ['security', 'protection', 'safety', 'vulnerabilities']
    },
    // Tools
    {
      id: 'digital-footprint-tool',
      title: 'Digital Footprint Analyzer',
      description: 'Discover your online presence',
      path: '/resources/tools/digital-footprint',
      type: 'tool',
      category: 'Tools',
      icon: Search,
      priority: 7,
      keywords: ['digital footprint', 'analyzer', 'online presence', 'tracking']
    },
    {
      id: 'cookie-tracker-tool',
      title: 'Cookie & Tracker Scanner',
      description: 'Scan websites for trackers',
      path: '/resources/tools/cookie-tracker',
      type: 'tool',
      category: 'Tools',
      icon: Search,
      priority: 7,
      keywords: ['cookies', 'trackers', 'scanner', 'privacy']
    },
    // Personas
    {
      id: 'cautious-parent',
      title: 'Cautious Parent',
      description: 'Family privacy protection',
      path: '/personas/cautious-parent',
      type: 'persona',
      category: 'Personas',
      icon: Search,
      priority: 6,
      keywords: ['parent', 'family', 'children', 'protection']
    },
    {
      id: 'privacy-advocate',
      title: 'Privacy Advocate',
      description: 'Advanced privacy protection',
      path: '/personas/privacy-advocate',
      type: 'persona',
      category: 'Personas',
      icon: Search,
      priority: 6,
      keywords: ['advocate', 'advanced', 'expert', 'privacy']
    }
  ], []);

  // Handle result click
  const handleResultClick = useCallback((result: SearchResult) => {
    navigate(result.path);
    onClose();
    setQuery('');
    
    // Add to recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== result.title);
      return [result.title, ...filtered].slice(0, 5);
    });
  }, [navigate, onClose]);

  // Filter results based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    const filtered = searchData
      .filter(item => {
        const searchTerm = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
          item.category.toLowerCase().includes(searchTerm)
        );
      })
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8);

    setResults(filtered);
    setSelectedIndex(0);
    setIsLoading(false);
  }, [query, searchData]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          onClose();
          setQuery('');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, handleResultClick, onClose]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  // Get result icon based on type
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'assessment':
        return <Search className="h-4 w-4" />;
      case 'tool':
        return <Zap className="h-4 w-4" />;
      case 'persona':
        return <Star className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  // Get result color based on type
  const getResultColor = (type: string) => {
    switch (type) {
      case 'assessment':
        return 'text-accent';
      case 'tool':
        return 'text-success';
      case 'persona':
        return 'text-primary';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 bg-white dark:bg-card rounded-lg shadow-xl border border-border z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            {/* Search Input */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search pages, tools, and guides..."
                  className="w-full py-3 pl-10 pr-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-base"
                  value={query}
                  onChange={handleInputChange}
                  aria-label="Search input"
                  aria-autocomplete="list"
                  aria-controls="search-results"
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
                    aria-label="Clear search"
                    title="Clear search"
                    type="button"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            <div 
              id="search-results"
              className="max-h-96 overflow-y-auto"
              aria-label="Search results"
            >
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                  <p className="mt-3 text-sm">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <ul className="py-2 list-none" role="listbox" aria-label="Search results">
                  {results.map((result, index) => (
                    <li key={result.id} role="option" {...(index === selectedIndex ? { "aria-selected": "true" } : { "aria-selected": "false" })}>
                      <motion.button
                        onClick={() => handleResultClick(result)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-card-hover transition-colors flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                          index === selectedIndex ? 'bg-gray-50 dark:bg-card-hover' : ''
                        }`}
                        whileHover={{ x: 4 }}
                        aria-label={`${result.title}: ${result.description}`}
                      >
                      <div className={`flex-shrink-0 ${getResultColor(result.type)}`}>
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {result.title}
                          </h4>
                          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                            {result.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {result.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </motion.button>
                    </li>
                  ))}
                </ul>
              ) : query ? (
                <div className="p-8 text-center text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-base">No results found for "{query}"</p>
                  <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
                </div>
              ) : recentSearches.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(search)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-card-hover transition-colors flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    aria-label={`Search for ${search}`}
                  >
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-base">Start typing to search</p>
                  <p className="text-sm text-gray-400 mt-1">Find pages, tools, and guides</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border bg-gray-50 dark:bg-gray-800 rounded-b-lg">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>Esc Close</span>
                </div>
                <span>Press Esc to close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;