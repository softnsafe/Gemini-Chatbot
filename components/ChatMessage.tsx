import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User, AlertCircle } from 'lucide-react';
import { Message, Role } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const isError = message.isError;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-indigo-600 text-white' : isError ? 'bg-red-100 text-red-600' : 'bg-emerald-600 text-white'
        }`}>
          {isUser ? <User size={18} /> : isError ? <AlertCircle size={18} /> : <Bot size={18} />}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed overflow-hidden ${
              isUser
                ? 'bg-indigo-600 text-white rounded-tr-sm'
                : isError
                ? 'bg-red-50 border border-red-200 text-red-800 rounded-tl-sm'
                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.text}</p>
            ) : (
              <div className="prose prose-sm prose-slate max-w-none dark:prose-invert">
                 <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            )}
          </div>
          
          {/* Metadata */}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] text-slate-400">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {message.role === Role.MODEL && message.isStreaming && (
               <span className="flex items-center gap-1">
                 <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                 <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                 <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
               </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
