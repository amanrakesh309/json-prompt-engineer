import React, { useState } from 'react';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { Suggestions } from './Suggestions';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface JsonOutputProps {
  jsonString: string;
  onJsonChange: (json: string) => void;
  isLoading: boolean;
  error: string | null;
  suggestions: string[];
  isSuggesting: boolean;
  suggestionError: string | null;
}

export const JsonOutput: React.FC<JsonOutputProps> = ({
  jsonString,
  onJsonChange,
  isLoading,
  error,
  suggestions,
  isSuggesting,
  suggestionError
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!jsonString) return;
    navigator.clipboard.writeText(jsonString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full text-gray-400">
          <LoadingSpinner className="w-12 h-12 mb-4" />
          <p className="text-lg">Building your output...</p>
          <p className="text-sm">Crafting the perfect structured prompt.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full w-full text-red-400 p-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">An Error Occurred</h3>
            <p className="bg-red-900/50 p-3 rounded-md">{error}</p>
          </div>
        </div>
      );
    }

    if (jsonString) {
      return (
        <textarea
            value={jsonString}
            onChange={(e) => onJsonChange(e.target.value)}
            className="w-full h-full p-4 bg-transparent border-none rounded-md focus:outline-none resize-none text-cyan-300 font-mono text-sm"
            spellCheck="false"
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-full w-full text-gray-500">
        <div className="text-center">
          <h3 className="text-xl font-semibold">Awaiting prompt...</h3>
          <p>Your generated JSON will appear here.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg flex flex-col h-full min-h-[400px] md:min-h-0">
      <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex-shrink-0">Structured & Editable JSON</h2>
      <div className="relative bg-black/40 rounded-md flex-grow overflow-hidden">
        {renderContent()}
        {jsonString && !isLoading && !error && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 text-gray-400 bg-gray-900/50 hover:bg-gray-700 rounded-md transition-all duration-200"
            aria-label="Copy JSON"
          >
            {isCopied ? (
              <CheckIcon className="w-5 h-5 text-green-400" />
            ) : (
              <ClipboardIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      <Suggestions
        suggestions={suggestions}
        isLoading={isSuggesting}
        error={suggestionError}
      />
    </div>
  );
};