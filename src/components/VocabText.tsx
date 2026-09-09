import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { MYSTERY_DICTIONARY } from '../data/dictionary';

interface VocabTextProps {
  children: string;
}

export default function VocabText({ children }: VocabTextProps) {
  const { stats, activeDictionary } = useStore();
  const [activeWord, setActiveWord] = useState<string | null>(null);

  // Default to true if learningMode is undefined
  const isLearningMode = stats?.learningMode ?? true;

  if (!isLearningMode || typeof children !== 'string') {
    return <>{children}</>;
  }

  const combinedDictionary = { ...MYSTERY_DICTIONARY, ...activeDictionary };

  // Regex to split by word boundaries, preserving whitespace and punctuation
  const parts = children.split(/(\b[\w'-]+\b)/g);

  return (
    <>
      {parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        if (combinedDictionary[lowerPart]) {
          return (
            <span key={i} className="relative inline-block">
              <span 
                className="text-[#D4A373] font-semibold border-b border-dashed border-[#D4A373] cursor-pointer hover:bg-[#D4A373]/10 px-0.5 rounded transition-colors"
                onClick={() => setActiveWord(activeWord === lowerPart ? null : lowerPart)}
              >
                {part}
              </span>
              {activeWord === lowerPart && (
                <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#2D331F] text-[#FDFBF7] text-xs rounded shadow-lg text-center font-normal leading-relaxed before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-[#2D331F] block">
                  <span className="block font-bold mb-1 capitalize text-[#E9EDC6]">{lowerPart}</span>
                  {combinedDictionary[lowerPart]}
                </span>
              )}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
