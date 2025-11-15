import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import SearchModal from './SearchModal';

const SearchIcon: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.button
        onClick={handleSearchClick}
        className="flex items-center justify-center w-10 h-10 text-white hover:text-white hover:bg-white/10 rounded-md transition-all duration-200 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open search"
        title="Search"
      >
        <Search className="h-5 w-5 text-accent group-hover:text-accent transition-colors duration-200" />
      </motion.button>

      <SearchModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
      />
    </>
  );
};

export default SearchIcon;