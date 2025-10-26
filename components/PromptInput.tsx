import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { ComplexityToggle } from './ComplexityToggle';
import { Complexity } from '../App';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  userContext: string;
  setUserContext: (context: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  complexity: Complexity;
  setComplexity: (complexity: Complexity) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setPrompt,
  userContext,
  setUserContext,
  onGenerate,
  isLoading,
  complexity,
  setComplexity
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onGenerate();
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg flex flex-col h-full">
      {/* Main Prompt */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-100">Your Simple Idea</h2>
      <p className="text-gray-400 mb-4">
        Describe your idea in plain text. The more detail you provide, the better the resulting JSON prompt will be.
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g., Design a website to check if a JSON is valid"
        className="w-full p-4 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200 resize-none text-gray-200"
        rows={8}
        disabled={isLoading}
      />
      <div className="mt-4 text-xs text-gray-500">
        Pro-tip: Use Ctrl+Enter or Cmd+Enter to generate.
      </div>
      
      {/* User Context Input */}
      <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-100">Describe the output type (Optional)</h2>
       <p className="text-gray-400 mb-4 text-sm">
        Give us a hint! If left blank, we'll analyze your prompt to figure it out.
      </p>
      <input
        type="text"
        value={userContext}
        onChange={(e) => setUserContext(e.target.value)}
        placeholder="e.g., A business plan, a story outline, a software spec"
        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200 text-gray-200"
        disabled={isLoading}
      />

      {/* Complexity Toggle */}
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-100">Select Complexity</h2>
      <ComplexityToggle
        selectedComplexity={complexity}
        onComplexityChange={setComplexity}
        disabled={isLoading}
      />

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isLoading || !prompt.trim()}
        className="mt-6 w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
      >
        {isLoading ? (
          'Engineering...'
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 mr-2" />
            Generate JSON Prompt
          </>
        )}
      </button>
    </div>
  );
};