
import { PenTool } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="container mx-auto flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg">
          <PenTool className="w-5 h-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold font-headline text-foreground tracking-tighter">
          PrecisionWrite
        </h1>
      </div>
    </header>
  );
}
