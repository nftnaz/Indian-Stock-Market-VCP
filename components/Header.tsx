
import React from 'react';
import { ChartBarIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-surface shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChartBarIcon />
          <h1 className="text-xl font-bold text-text">VCP Stock Scanner</h1>
        </div>
        <a 
          href="https://github.com/google/generative-ai-docs/tree/main/app-development/web" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm font-medium text-subtle hover:text-text transition-colors duration-200 rounded-md bg-overlay hover:bg-opacity-75"
        >
          View Source
        </a>
      </div>
    </header>
  );
};