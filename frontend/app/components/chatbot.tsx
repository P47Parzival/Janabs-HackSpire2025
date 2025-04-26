'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsRobot, BsSend, BsPerson } from 'react-icons/bs';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: "user",
              content: userMessage
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/60 border-slate-700/50 w-full max-w-3xl mx-auto">
      <CardHeader className="border-b border-slate-700/50">
        <CardTitle className="text-slate-200 flex items-center gap-2">
          <BsRobot className="text-indigo-400" />
          AI Learning Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea 
          ref={scrollRef}
          className="h-[400px] pr-4"
        >
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "flex gap-2",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div className={cn(
                    "flex items-start gap-2 max-w-[80%]",
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.role === 'user' 
                        ? 'bg-indigo-600' 
                        : 'bg-slate-700/50'
                    )}>
                      {message.role === 'user' ? (
                        <BsPerson className="text-white" />
                      ) : (
                        <BsRobot className="text-indigo-400" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "rounded-lg p-3 text-sm",
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700/50 text-slate-200'
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                  <BsRobot className="text-indigo-400" />
                </div>
                <div className="bg-slate-700/50 text-slate-200 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your learning..."
            className="flex-1 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          >
            <BsSend className="mr-2" />
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 