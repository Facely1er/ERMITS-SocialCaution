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

const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
    setQuery('');
    
    // Add to recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== result.title);
      return [result.title, ...filtered].slice(0, 5);
    });
  }, [navigate]);

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
          setIsOpen(false);
          setQuery('');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, handleResultClick]);

  // Handle search input focus
  const handleFocus = () => {
    setIsOpen(true);
  };

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
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          className="w-full py-1.5 pl-8 pr-8 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-accent focus:border-transparent transition-all duration-200 text-sm"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-card rounded-lg shadow-xl border border-border max-h-96 overflow-y-auto z-50"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
                <p className="mt-2 text-sm">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <motion.button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-card-hover transition-colors flex items-center gap-3 ${
                      index === selectedIndex ? 'bg-gray-50 dark:bg-card-hover' : ''
                    }`}
                    whileHover={{ x: 4 }}
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
                ))}
              </div>
            ) : query ? (
              <div className="p-4 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No results found for "{query}"</p>
                <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
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
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-card-hover transition-colors flex items-center gap-3"
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Start typing to search</p>
                <p className="text-xs text-gray-400 mt-1">Find pages, tools, and guides</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;