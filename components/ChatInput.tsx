import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  return (
    <div className="max-w-4xl mx-auto w-full p-4">
      <div className="relative flex items-end gap-2 bg-white border border-slate-200 rounded-xl shadow-sm p-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          rows={1}
          className="flex-1 w-full bg-transparent border-0 focus:ring-0 resize-none py-3 px-2 text-slate-800 placeholder:text-slate-400 text-sm max-h-[150px] overflow-y-auto"
        />
        <button
          onClick={() => handleSubmit()}
          disabled={!text.trim() || disabled}
          className={`p-3 rounded-lg flex-shrink-0 transition-all duration-200 ${
            !text.trim() || disabled
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-95'
          }`}
        >
          {disabled ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </div>
      <div className="text-center mt-2">
        <p className="text-[10px] text-slate-400">
          Powered by Gemini 3 Flash. AI can make mistakes.
        </p>
      </div>
    </div>
  );
};
