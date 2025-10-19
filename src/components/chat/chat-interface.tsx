
'use client';

import React, { useState, useTransition, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { analyzeText, type AnalysisResult } from '@/app/actions';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from './chat-message';
import { Bot, Loader, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  correctedText?: string;
  report?: string;
};

const FormSchema = z.object({
  text: z.string().min(1, 'Please enter some text to analyze.'),
});

const welcomeMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  text: 'Welcome to PrecisionWrite! Enter your text below, and I will analyze it for errors, provide a corrected version, and give you a detailed feedback report to help improve your writing skills.',
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: '',
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: data.text,
    };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    startTransition(async () => {
      const result: AnalysisResult = await analyzeText(data.text);
      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: result.originalText,
          correctedText: result.correctedText,
          report: result.errorReport,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="container mx-auto max-w-4xl space-y-8">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isPending && (
            <div className="flex items-start gap-4">
              <Avatar className="w-8 h-8 border border-primary">
                <AvatarFallback>
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <Loader className="w-5 h-5 animate-spin" />
                <span>PrecisionWrite is analyzing...</span>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 md:p-6 border-t bg-background/80 backdrop-blur-sm sticky bottom-0">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
            <Textarea
              {...form.register('text')}
              placeholder="Enter your text here..."
              className="flex-1 resize-none bg-input"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)();
                }
              }}
              disabled={isPending}
            />
            <Button type="submit" size="lg" disabled={isPending || !form.formState.isValid}>
              {isPending ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="sr-only">Analyze</span>
            </Button>
          </form>
          {form.formState.errors.text && (
            <p className="text-sm text-destructive mt-2">{form.formState.errors.text.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
