import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, Send, RotateCcw, Key, CheckCircle2, ShieldCheck, ExternalLink, X, Info } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { AIMessage } from '../components/AIMessage';
import { Button } from '../components/Button';
import { BottomSheet } from '../components/BottomSheet';
import { Input } from '../components/Input';
import { useToast } from '../context/ToastContext';

export const AIConcierge = () => {
  const location = useLocation();
  const { aiChatMessages, sendAIChatMessage, clearAIChat, geminiApiKey, saveApiKey } = useProperties();
  const { showToast } = useToast();

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || '');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiChatMessages, isTyping]);

  useEffect(() => {
    if (location.state?.initialPrompt) {
      handleSendMessage(location.state.initialPrompt);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputVal;
    if (!text || !text.trim() || isTyping) return;

    setInputVal('');
    setIsTyping(true);

    setTimeout(async () => {
      await sendAIChatMessage(text);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    saveApiKey(apiKeyInput);
    setIsApiKeyModalOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)] max-w-3xl mx-auto -mx-4 sm:mx-auto">
      {/* Concierge Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/80 dark:bg-[#1A1D27]/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#2D3143]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-10px bg-gradient-to-tr from-[#3B4FCD] to-[#0EA5A0] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold font-heading text-[#111827] dark:text-[#F1F5F9]">
                PropEase AI Concierge
              </h2>
              {geminiApiKey ? (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-4px bg-[#D1FAE5] dark:bg-[#064E3B] text-[#059669] dark:text-[#6EE7B7] flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Live API
                </span>
              ) : (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-4px bg-[#CCFBF1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#5EEAD4]">
                  Built-in AI
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
              Auto-correction & All TN Districts Enabled
            </p>
          </div>
        </div>

        {/* Right Header Buttons: API Key & New Chat */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setApiKeyInput(geminiApiKey || '');
              setIsApiKeyModalOpen(true);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-8px text-xs font-semibold border transition-all ${
              geminiApiKey
                ? 'bg-[#D1FAE5] dark:bg-[#064E3B]/40 text-[#059669] dark:text-[#6EE7B7] border-[#A7F3D0] dark:border-[#065F46]'
                : 'bg-[#F3F4F6] dark:bg-[#23262F] text-[#4B5563] dark:text-[#D1D5DB] border-[#E5E7EB] dark:border-[#3A3F52] hover:border-[#3B4FCD]'
            }`}
            title="Connect Gemini API Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{geminiApiKey ? 'API Connected' : 'Join API Key'}</span>
          </button>

          <button
            onClick={clearAIChat}
            className="flex items-center gap-1 px-2.5 py-1 rounded-8px text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F1F5F9] hover:bg-[#F3F4F6] dark:hover:bg-[#23262F] transition-all"
            title="Restart Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
        {aiChatMessages.map((msg) => (
          <AIMessage
            key={msg.id}
            message={msg}
            onSelectPrompt={(p) => handleSendMessage(p)}
          />
        ))}

        {/* Typing Animation Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 max-w-[80%] animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#3B4FCD] to-[#0EA5A0] flex items-center justify-center text-white flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <div className="p-3 rounded-16px rounded-tl-4px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3B4FCD] dot-1" />
              <span className="w-2 h-2 rounded-full bg-[#3B4FCD] dot-2" />
              <span className="w-2 h-2 rounded-full bg-[#3B4FCD] dot-3" />
              <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] ml-1">
                Analyzing destination data...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-white/95 dark:bg-[#0F1117]/95 border-t border-[#E5E7EB] dark:border-[#2D3143] backdrop-blur-md">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything (auto-corrects typos: 'coimbator', 'aprtment')..."
            className="flex-1 h-11 pl-3.5 pr-11 rounded-14px bg-[#F3F4F6] dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] text-xs sm:text-sm text-[#111827] dark:text-[#F1F5F9] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B4FCD] focus:ring-2 focus:ring-[#EEF2FF] dark:focus:ring-[#23262F] transition-all"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputVal.trim() || isTyping}
            className="w-10 h-10 rounded-12px bg-[#3B4FCD] hover:bg-[#2A3BAA] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Join Gemini API Key Modal */}
      <BottomSheet
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        title="Connect Live Gemini API Key"
      >
        <form onSubmit={handleSaveApiKey} className="flex flex-col gap-3.5 py-1 text-left">
          <div className="p-3 rounded-12px bg-[#EEF2FF] dark:bg-[#1E1B4B]/30 border border-[#C7D2FE] dark:border-[#3730A3]/50 text-xs text-[#3730A3] dark:text-[#C7D2FE] leading-relaxed">
            <span className="font-bold flex items-center gap-1 mb-1">
              <Key className="w-3.5 h-3.5" />
              Optional Live AI Integration:
            </span>
            Connect your own free Google Gemini API Key to enable real-time generative responses. If left empty, PropEase uses the built-in offline Tamil Nadu reasoning engine with auto-correction.
          </div>

          <Input
            label="Google Gemini API Key"
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            helperText="Stored locally in your browser's localStorage"
          />

          <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF] pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[#3B4FCD] dark:text-[#A5B4FC] hover:underline flex items-center gap-1 font-bold"
            >
              Get Free Gemini API Key
              <ExternalLink className="w-3 h-3" />
            </a>

            {geminiApiKey && (
              <button
                type="button"
                onClick={() => {
                  saveApiKey('');
                  setApiKeyInput('');
                  setIsApiKeyModalOpen(false);
                }}
                className="text-xs text-[#EF4444] hover:underline font-bold"
              >
                Disconnect Key
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#2D3143]">
            <Button type="submit" size="md" variant="primary" className="w-full">
              {apiKeyInput.trim() ? 'Save & Connect API Key' : 'Close'}
            </Button>
          </div>
        </form>
      </BottomSheet>
    </div>
  );
};
