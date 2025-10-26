import React, { useState, useCallback } from 'react';
import { PromptInput } from './components/PromptInput';
import { JsonOutput } from './components/JsonOutput';
import { generateJsonPrompt, generateKeywordSuggestions } from './services/geminiService';
import { RefreshIcon } from './components/icons/RefreshIcon';

export type Complexity = 'Basic' | 'Precise' | 'Advanced';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [userContext, setUserContext] = useState<string>('');
  const [generatedJson, setGeneratedJson] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [complexity, setComplexity] = useState<Complexity>('Precise');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setIsSuggesting(true);
    setError(null);
    setSuggestionError(null);
    setGeneratedJson('');
    setSuggestions([]);

    try {
      const jsonResponse = await generateJsonPrompt(prompt, complexity, userContext);
      const parsed = JSON.parse(jsonResponse);
      const formatted = JSON.stringify(parsed, null, 2);
      setGeneratedJson(formatted);

      // Now, generate suggestions based on the new JSON
      try {
        const suggestedKeywords = await generateKeywordSuggestions(prompt, formatted);
        setSuggestions(suggestedKeywords);
      } catch (suggestionErr) {
        setSuggestionError(suggestionErr instanceof Error ? suggestionErr.message : 'Could not fetch suggestions.');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setIsSuggesting(false);
    }
  }, [prompt, complexity, userContext]);

  const handleClear = useCallback(() => {
    setPrompt('');
    setUserContext('');
    setGeneratedJson('');
    setIsLoading(false);
    setError(null);
    setSuggestions([]);
    setIsSuggesting(false);
    setSuggestionError(null);
  }, []);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="relative text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            JSON Prompt Engineer
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Transform your simple ideas into powerful, structured JSON prompts for superior AI results.
          </p>
           <button
            onClick={handleClear}
            className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Clear all"
            title="Clear all"
          >
            <RefreshIcon className="w-5 h-5" />
          </button>
        </header>

        {/* --- AD SLOT 1: Top Banner (728x90) --- */}
        <div className="mb-8 h-[90px] bg-red-900/30 border border-red-700 flex items-center justify-center rounded-lg text-red-400 text-sm font-mono">
            [ Placeholder Ad Slot: Top Banner (728x90) - Insert Ad Code Here ]
        </div>
        {/* ------------------------------------- */}

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            userContext={userContext}
            setUserContext={setUserContext}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            complexity={complexity}
            setComplexity={setComplexity}
          />
          <JsonOutput
            jsonString={generatedJson}
            onJsonChange={setGeneratedJson}
            isLoading={isLoading}
            error={error}
            suggestions={suggestions}
            isSuggesting={isSuggesting}
            suggestionError={suggestionError}
          />
        </main>

        {/* --- AD SLOT 2: Bottom Horizontal Ad (Full Width) --- */}
        <div className="mt-8 mb-4 h-[90px] bg-red-900/30 border border-red-700 flex items-center justify-center rounded-lg text-red-400 text-sm font-mono">
            [ Placeholder Ad Slot: Bottom Horizontal Ad (e.g., 970x90) - Insert Ad Code Here ]
        </div>
        {/* -------------------------------------------------- */}

        {/* --- NEW NOTICE BOARD & FEEDBACK SECTION --- */}
        <div className="mt-12 p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-3 text-indigo-400 flex items-center">
              📢 Feature Pipeline
            </h3>
            <ul className="list-disc list-inside text-gray-400 space-y-1 ml-2 text-sm">
              <li>Planned:  User login, with 'Save & Share' feature and history for generated prompts.</li>
            </ul>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-gray-700 md:pl-6 pt-4 md:pt-0">
            <h3 className="text-xl font-semibold mb-3 text-cyan-400 flex items-center">
              ✍️ Feedback
            </h3>
            <p className="text-gray-400 text-sm mb-2">
              Love the app? Encountered a bug? Send me your feedback!
            </p>
            <a
              href="mailto:amanrakesh309@gmail.com"
              className="inline-block px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors text-sm"
            >
              Send Feedback
            </a>
          </div>
        </div>


        <footer className="text-center mt-12 text-gray-500 text-sm flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          {/* <p>Powered by Google Gemini</p>
          <span className="hidden sm:inline text-gray-600 text-lg">|</span> */}
          <div className="flex items-center space-x-2">
            <p className="text-gray-400">Support the project:</p>
            <a
              href="https://buymeacoffee.com/amanrakesh046" // ⬅️ IMPORTANT: Replace this with your actual link!
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 font-semibold px-3 py-1 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors shadow-lg"
            >
              ☕ Buy me a Coffee
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;