import React, { useState, useEffect, useRef } from 'react';
import useGeolocation from '../hooks/useGeolocation';
import { generateChatResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';
import Spinner from './common/Spinner';
import { Send, MapPin, Search, Globe, Bot, User } from 'lucide-react';
import { GroundingChunk } from '@google/genai';

const Chatbot: React.FC = () => {
    const { location, error: locationError } = useGeolocation();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const { text, sources } = await generateChatResponse(input, location);
            const modelMessage: ChatMessage = { role: 'model', text, sources };
            setMessages(prev => [...prev, modelMessage]);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderSource = (source: GroundingChunk, index: number) => {
        if (source.web) {
            return <a href={source.web.uri} target="_blank" rel="noopener noreferrer" key={`web-${index}`} className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 bg-slate-700/50 px-2 py-1 rounded-md transition-colors"><Search className="w-3 h-3"/>{source.web.title}</a>;
        }
        if (source.maps) {
            return <a href={source.maps.uri} target="_blank" rel="noopener noreferrer" key={`map-${index}`} className="flex items-center gap-2 text-xs text-green-400 hover:text-green-300 bg-slate-700/50 px-2 py-1 rounded-md transition-colors"><Globe className="w-3 h-3"/>{source.maps.title}</a>
        }
        return null;
    };

    return (
        <div className="flex flex-col h-[65vh]">
            <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>}
                        <div className={`max-w-md p-4 rounded-2xl ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-600">
                                    <h4 className="text-xs font-semibold text-slate-400 mb-2">Sources:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {msg.sources.map(renderSource)}
                                    </div>
                                </div>
                            )}
                        </div>
                        {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center"><User className="w-5 h-5 text-white" /></div>}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
                        <div className="max-w-md p-4 rounded-2xl bg-slate-700 text-slate-200 rounded-bl-none">
                            <Spinner />
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>

            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg mt-4 text-sm">{error}</p>}

            <div className="mt-6 flex-shrink-0">
                <div className="flex items-center gap-3 bg-slate-700 p-2 rounded-lg">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                        placeholder="Ask anything..."
                        className="flex-grow bg-transparent focus:outline-none px-2"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="p-2 bg-cyan-600 rounded-md hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <Send className="w-5 h-5 text-white" />
                    </button>
                </div>
                 <div className="flex items-center text-xs text-slate-500 mt-2 gap-2">
                    <MapPin className="w-3 h-3"/>
                    <span>{location ? `Location services enabled.` : locationError ? `Location Error: ${locationError}` : 'Loading location...'}</span>
                 </div>
            </div>
        </div>
    );
};

export default Chatbot;