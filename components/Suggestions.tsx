import React, { useState } from 'react';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface SuggestionsProps {
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
}

export const Suggestions: React.FC<SuggestionsProps> = ({ suggestions, isLoading, error }) => {
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const handleCopy = (keyword: string) => {
    navigator.clipboard.writeText(`"${keyword}": `);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center text-sm text-gray-400">
          <LoadingSpinner className="w-4 h-4 mr-2" />
          <span>Getting suggestions...</span>
        </div>
      );
    }

    if (error) {
      return <p className="text-sm text-red-400">{error}</p>;
    }

    if (suggestions.length > 0) {
      return (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((keyword) => (
            <div
              key={keyword}
              className="group flex items-center bg-gray-700/50 rounded-full text-sm"
            >
              <span className="px-3 py-1 text-cyan-300">{keyword}</span>
              <button
                onClick={() => handleCopy(keyword)}
                className="p-1.5 rounded-full hover:bg-gray-600 focus:outline-none focus:bg-gray-600 transition-colors"
                aria-label={`Copy keyword ${keyword}`}
              >
                <ClipboardIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </button>
              {copiedKeyword === keyword && (
                <span className="absolute -mt-10 ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">Copied!</span>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  if (isLoading || error || suggestions.length > 0) {
      return (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Suggestions</h3>
          <div className="bg-black/20 p-3 rounded-md min-h-[50px] flex items-center">
            {renderContent()}
          </div>
        </div>
      );
  }

  return null;
};