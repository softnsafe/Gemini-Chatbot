import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Trash2, Github } from 'lucide-react';
import { getChatSession, resetChatSession } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Message, Role } from './types';
import { WELCOME_MESSAGE, APP_NAME } from './constants';
import { GenerateContentResponse } from '@google/genai';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: Role.MODEL,
        text: WELCOME_MESSAGE,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the conversation?")) {
      resetChatSession();
      setMessages([
        {
          id: 'welcome-' + Date.now(),
          role: Role.MODEL,
          text: WELCOME_MESSAGE,
          timestamp: Date.now(),
        },
      ]);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMessageId = Date.now().toString();
    const newUserMessage: Message = {
      id: userMessageId,
      role: Role.USER,
      text: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    // Create placeholder for bot response
    const botMessageId = (Date.now() + 1).toString();
    const initialBotMessage: Message = {
      id: botMessageId,
      role: Role.MODEL,
      text: '', // Start empty
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, initialBotMessage]);

    try {
      const chat = getChatSession();
      const result = await chat.sendMessageStream({ message: text });
      
      let fullText = '';
      
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text || '';
        fullText += chunkText;

        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMessageId 
              ? { ...msg, text: fullText } 
              : msg
          )
        );
      }

      // Finalize message
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMessageId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );

    } catch (error: any) {
      console.error("Error sending message:", error);
      let errorMessage = "I'm sorry, I encountered an error while processing your request. Please try again.";

      // Improve error message for missing API key
      if (error.message === "API_KEY is missing") {
        errorMessage = "Configuration Error: API Key is missing. Please add VITE_API_KEY to your Vercel Environment Variables and redeploy.";
      }

      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMessageId 
            ? { 
                ...msg, 
                text: errorMessage, 
                isStreaming: false,
                isError: true
              } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="flex-none h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg text-white">
            <MessageSquare size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">{APP_NAME}</h1>
            <p className="text-xs text-slate-500 font-medium">Flash 3 Preview</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="View on GitHub"
          >
            <Github size={20} />
          </a>
          <button 
            onClick={handleClearChat}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear Conversation"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 scroll-smooth">
        <div className="max-w-4xl mx-auto flex flex-col min-h-full">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-none bg-white/80 backdrop-blur-md border-t border-slate-200">
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </footer>
    </div>
  );
};

export default App;
