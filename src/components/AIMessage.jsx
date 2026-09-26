import React from 'react';
import { Sparkles, Bot, User } from 'lucide-react';
import { PropertyMiniCard } from './PropertyMiniCard';

export const AIMessage = ({ message, onSelectPrompt }) => {
  const isAI = message.sender === 'ai';

  // Format simple markdown bold and bullet lines
  const formatText = (content) => {
    if (!content) return null;
    return content.split('\n').map((line, lineIdx) => {
      // Bold formatter
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={partIdx} className="font-semibold text-[#111827] dark:text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <React.Fragment key={lineIdx}>
          {line.startsWith('• ') ? (
            <div className="flex items-start gap-1.5 ml-1 my-0.5">
              <span className="text-[#3B4FCD] dark:text-[#A5B4FC] font-bold">•</span>
              <span>{formattedParts}</span>
            </div>
          ) : line.startsWith('### ') ? (
            <h4 className="font-bold text-sm text-[#111827] dark:text-[#F1F5F9] mt-2 mb-1">
              {line.replace('### ', '')}
            </h4>
          ) : (
            <p className={lineIdx > 0 ? 'mt-1.5' : ''}>{formattedParts}</p>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`flex flex-col gap-2 w-full animate-fade-in ${isAI ? 'items-start' : 'items-end'}`}>
      <div className={`flex gap-2.5 max-w-[92%] sm:max-w-[85%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar Icon */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm ${
          isAI
            ? 'bg-gradient-to-tr from-[#3B4FCD] to-[#0EA5A0] text-white'
            : 'bg-[#EEF2FF] dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#EEF2FF]'
        }`}>
          {isAI ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>

        {/* Bubble */}
        <div
          className={`p-3.5 rounded-20px text-sm leading-relaxed ${
            isAI
              ? 'bg-white dark:bg-[#1A1D27] text-[#111827] dark:text-[#F1F5F9] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card rounded-tl-4px'
              : 'bg-[#3B4FCD] text-white shadow-sm rounded-tr-4px'
          }`}
        >
          <div className="text-xs sm:text-sm font-normal">
            {formatText(message.text)}
          </div>

          {/* Embedded Property Mini Cards */}
          {message.properties && message.properties.length > 0 && (
            <div className="flex flex-col gap-2 mt-3 pt-2.5 border-t border-[#E5E7EB] dark:border-[#2D3143]">
              <span className="text-[11px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">
                Recommended Properties:
              </span>
              {message.properties.map(property => (
                <PropertyMiniCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* Timestamp */}
          <div className={`text-[10px] mt-1.5 text-right ${isAI ? 'text-[#9CA3AF]' : 'text-white/70'}`}>
            {message.timestamp}
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips below AI message */}
      {isAI && message.suggestedPrompts && message.suggestedPrompts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 ml-10 mt-1 max-w-[90%]">
          {message.suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt && onSelectPrompt(prompt)}
              className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-white dark:bg-[#1A1D27] border border-[#3B4FCD]/30 dark:border-[#3B4FCD]/40 text-[#3B4FCD] dark:text-[#A5B4FC] hover:bg-[#EEF2FF] dark:hover:bg-[#23262F] transition-all duration-150 shadow-sm text-left active:scale-95"
            >
              ✨ {prompt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
