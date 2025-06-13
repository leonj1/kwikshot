import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700/50 dark:bg-gray-700/50 bg-gray-200/50 hover:bg-gray-600/50 dark:hover:bg-gray-600/50 hover:bg-gray-300/50 transition-all duration-200 hover:scale-105 active:scale-95"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : 180,
          scale: isDark ? 1 : 0.8,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {isDark ? (
          <Moon size={16} className="text-gray-300 hover:text-white transition-colors" />
        ) : (
          <Sun size={16} className="text-yellow-600 hover:text-yellow-500 transition-colors" />
        )}
      </motion.div>
    </motion.button>
  );
};
