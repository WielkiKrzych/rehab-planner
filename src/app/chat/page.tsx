'use client';

import { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/context/AppContext';

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const { patients } = useApp();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async (patientId: string) => {
    try {
      const res = await fetch(`/api/chat?patientId=${patientId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  useEffect(() => {
    if (selectedPatient) {
      loadMessages(selectedPatient);
    } else {
      setMessages([]);
    }
  }, [selectedPatient]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedPatient || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient,
          message: input,
        }),
      });

      const data = await res.json();
      
      if (data.assistantMessage) {
        setMessages(prev => [...prev, data.assistantMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const patient = patients.find(p => p.id === selectedPatient);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-white">AI </span>
            <span className="gradient-text glow-text">Asystent</span>
          </h1>
          <p className="text-white/50">Porozmawiaj z AI o postępach i ćwiczeniach.</p>
        </div>

        <div className="mb-4">
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="form-input w-full max-w-md"
          >
            <option value="">Wybierz pacjenta...</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>

        {selectedPatient ? (
          <>
            <div className="glass-card rounded-2xl flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-white/40 py-8">
                    <p className="text-4xl mb-4">🤖</p>
                    <p>Witaj! Jestem Twoim AI asystentem.</p>
                    <p className="mt-2">Możesz pytać mnie o:</p>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>• Postępy w rehabilitacji</li>
                      <li>• Wskazówki dotyczące ćwiczeń</li>
                      <li>• Regeneracja i sen</li>
                      <li>• Dieta i nawodnienie</li>
                    </ul>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 text-white'
                            : 'bg-black/30 border border-white/10 text-white/80'
                        }`}
                      >
                        <div className="text-xs mb-1 opacity-50">
                          {msg.role === 'user' ? patient?.firstName : 'AI Asystent'}
                        </div>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Napisz wiadomość..."
                    className="form-input flex-1"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="btn-neon px-6 py-3 rounded-xl disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-white/50">Wybierz pacjenta, aby rozpocząć rozmowę</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
