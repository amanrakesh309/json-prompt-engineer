import React from 'react';
import { Complexity } from '../App';

interface ComplexityToggleProps {
  selectedComplexity: Complexity;
  onComplexityChange: (complexity: Complexity) => void;
  disabled: boolean;
}

const options: { id: Complexity; label: string, description: string }[] = [
  { id: 'Basic', label: 'Basic', description: 'Just the essentials' },
  { id: 'Precise', label: 'Precise', description: 'A balanced level of detail' },
  { id: 'Advanced', label: 'Advanced', description: 'Maximum detail & creativity' },
];

export const ComplexityToggle: React.FC<ComplexityToggleProps> = ({ selectedComplexity, onComplexityChange, disabled }) => {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-900 p-1">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onComplexityChange(option.id)}
          disabled={disabled}
          className={`w-full rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 ${
            selectedComplexity === option.id
              ? 'bg-indigo-600 text-white shadow'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
          aria-pressed={selectedComplexity === option.id}
        >
          <div className="font-bold">{option.label}</div>
          <div className="text-xs opacity-80">{option.description}</div>
        </button>
      ))}
    </div>
  );
};