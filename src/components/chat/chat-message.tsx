
'use client';

import type { Message } from '@/components/chat/chat-interface';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, FileText, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import React from 'react';

export const ChatMessage = React.memo(({ message }: { message: Message }) => {
  if (message.role === 'user') {
    return (
      <div className="flex items-start gap-4 justify-end">
        <div className="bg-primary text-primary-foreground p-4 rounded-xl max-w-2xl shadow-md">
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  // Full analysis response from assistant
  if (message.correctedText) {
    return (
      <div className="flex items-start gap-4">
        <Avatar className="w-8 h-8 border-2 border-primary">
          <AvatarFallback>
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-headline">Original Text</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{message.text}</p>
              </CardContent>
            </Card>
            <Card className="border-accent bg-accent/10">
              <CardHeader>
                <CardTitle className="text-base font-headline text-accent-foreground">Corrected Text</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground whitespace-pre-wrap">{message.correctedText}</p>
              </CardContent>
            </Card>
          </div>
          {message.report && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <FileText className="w-4 h-4" />
                    Feedback Report
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{message.report}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>
    );
  }

  // Simple text message from assistant (e.g., welcome)
  return (
    <div className="flex items-start gap-4">
      <Avatar className="w-8 h-8 border-2 border-primary">
        <AvatarFallback>
          <Bot className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-card p-4 rounded-xl max-w-2xl shadow-md">
        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{message.text}</p>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';
