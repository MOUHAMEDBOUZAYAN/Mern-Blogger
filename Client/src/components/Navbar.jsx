import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LogOut, UserPlus, LogIn, Menu, X, PenSquare, Home, 
  BookOpen, Search, User, Info, Moon, Sun, Bell, Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function
  const debouncedSearch = debounce(async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      // Simulate API call - replace with actual search API
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const results = await response.json();
      setSearchResults(results.slice(0, 5)); // Limit to 5 results
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/articles?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchResults([]);
      setIsOpen(false);
    }
  };

  const handleSearchResultClick = (articleId) => {
    navigate(`/articles/${articleId}`);
    setSearchQuery('');
    setSearchResults([]);
    setIsOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/articles', label: 'Articles', icon: BookOpen },
    { path: '/about', label: 'About', icon: Info }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg' 
          : 'bg-gradient-to-r from-emerald-600 to-emerald-800 shadow-lg'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className={`text-2xl font-bold transition-colors ${
                scrolled 
                  ? 'text-emerald-700 dark:text-emerald-400' 
                  : 'text-white'
              }`}
            >
              <span className="bg-emerald-700 dark:bg-emerald-600 text-white px-2 py-1 rounded-md mr-1 font-mono">
                404
              </span>
              .js Blog
            </motion.span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-6" ref={searchRef}>
            <div className="relative w-full">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className={`w-full pl-4 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all ${
                    scrolled 
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                      : 'bg-white text-gray-900'
                  }`}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button 
                  type="submit"
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                    scrolled 
                      ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300' 
                      : 'text-emerald-600 hover:text-emerald-800'
                  }`}
                >
                  <Search size={18} />
                </button>
              </form>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto z-50"
                  >
                    {searchResults.map((result, index) => (
                      <motion.button
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSearchResultClick(result.id)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {result.title}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs truncate">
                          {result.excerpt}
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading indicator */}
              {isSearching && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <div className="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 font-medium px-3 py-2 rounded-md transition-all ${
                  isActiveRoute(path)
                    ? scrolled
                      ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                      : 'bg-white/20 text-white'
                    : scrolled
                      ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`p-2 rounded-md transition-colors ${
                scrolled 
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            
            {user ? (
              <>
                <Link
                  to="/articles/create"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-all ml-2 ${
                    scrolled 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-white text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <PenSquare size={18} />
                  <span>Create</span>
                </Link>

                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className={`p-2 rounded-md transition-colors relative ${
                    scrolled 
                      ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Bell size={18} />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </motion.button>

                {/* User Menu */}
                <div className="relative ml-2">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-all ${
                      scrolled 
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' 
                        : 'bg-emerald-700 text-white hover:bg-emerald-600'
                    }`}
                  >
                    <User size={18} />
                    <span>{user.name.split(' ')[0]}</span>
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User size={16} />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings size={16} />
                          <span>Settings</span>
                        </Link>
                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-all ${
                    scrolled 
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' 
                      : 'bg-white/90 text-emerald-700 hover:bg-white'
                  }`}
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-all ${
                    scrolled 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  <UserPlus size={18} />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu} 
              className={`focus:outline-none p-2 rounded-md transition-colors ${
                scrolled 
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' 
                  : 'text-white hover:bg-white/20'
              }`}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg py-4 px-4 space-y-3 mt-2 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-4 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 dark:text-emerald-400"
                >
                  <Search size={18} />
                </button>
              </form>

              {/* Mobile Navigation Items */}
              {navItems.map(({ path, label, icon: Icon }) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to={path}
                    className={`block w-full text-left flex items-center space-x-3 font-medium px-4 py-3 rounded-md transition-all ${
                      isActiveRoute(path)
                        ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                </motion.div>
              ))}

              {/* Theme Toggle Mobile */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={toggleTheme}
                className="w-full text-left flex items-center space-x-3 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-3 rounded-md transition-all"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </motion.button>

              {user ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <Link
                    to="/articles/create"
                    className="block w-full text-left flex items-center space-x-3 bg-emerald-600 text-white px-4 py-3 rounded-md font-medium hover:bg-emerald-700 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <PenSquare size={18} />
                    <span>Create Article</span>
                  </Link>
                  
                  <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-bold text-center">
                    {user.name}
                  </div>
                  
                  <Link
                    to="/profile"
                    className="block w-full text-left flex items-center space-x-3 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left flex items-center space-x-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-md font-medium hover:bg-red-200 dark:hover:bg-red-900/40 transition-all"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <Link 
                    to="/login" 
                    className="block w-full text-left flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-md font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full text-left flex items-center space-x-3 bg-emerald-600 text-white px-4 py-3 rounded-md font-medium hover:bg-emerald-700 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserPlus size={18} />
                    <span>Register</span>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;