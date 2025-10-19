
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Loader, User } from 'lucide-react';
import { generateGreeting } from './actions';

export default function Home() {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) return;

    startTransition(async () => {
      const result = await generateGreeting(name);
      setGreeting(result);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary p-2 rounded-lg">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-headline tracking-tight">Creative Greeter</CardTitle>
            </div>
            <CardDescription>Enter a name and let our AI create a unique greeting for you!</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="flex items-center gap-3">
                <User className="text-muted-foreground" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ada Lovelace"
                  className="bg-input"
                  disabled={isPending}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending || !name}>
                {isPending ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  'Greet Me'
                )}
              </Button>
            </CardFooter>
          </form>

          {greeting && (
             <CardContent className="border-t pt-6">
                <h3 className="font-semibold mb-2 text-center">AI's Greeting:</h3>
                <p className="text-center text-lg text-primary font-medium p-4 bg-primary/10 rounded-lg border border-primary/20">
                    {greeting}
                </p>
             </CardContent>
          )}
        </Card>
      </div>
    </main>
  );
}
