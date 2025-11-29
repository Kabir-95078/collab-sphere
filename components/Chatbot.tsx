
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: 'Hi! I\'m CollabBot. Ask me anything about finding partners or growing your channel! 🚀' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await getChatResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: responseText
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-96 glass-panel rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[fadeInUp_0.3s_ease-out] border border-brand-pink/30">
          
          {/* Header */}
          <div className="bg-brand-base/80 p-4 flex items-center justify-between border-b border-brand-pink/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-white shadow-lg">
                <i className="fas fa-robot text-sm"></i>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">CollabBot AI</h3>
                <div className="flex items-center gap-1">
                   <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                   <span className="text-[10px] text-gray-300">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-brand-deep/80">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] rounded-xl p-3 text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-brand-pink text-white rounded-br-none' 
                      : 'bg-brand-base text-gray-200 rounded-bl-none border border-brand-plum'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
               <div className="flex justify-start">
                 <div className="bg-brand-base border border-brand-plum rounded-xl rounded-bl-none p-3 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-brand-deep border-t border-brand-base flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for advice..."
              className="flex-1 bg-brand-base/40 border border-brand-base rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-pink placeholder-gray-500"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-full bg-brand-pink hover:bg-brand-plum text-white flex items-center justify-center transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </form>

        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95
          ${isOpen ? 'bg-brand-deep border border-brand-pink text-gray-400 rotate-90' : 'bg-gradient-to-r from-brand-pink to-brand-plum text-white'}
        `}
      >
        {isOpen ? (
            <i className="fas fa-chevron-down text-xl"></i>
        ) : (
            <i className="fas fa-comment-dots text-2xl animate-pulse"></i>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
