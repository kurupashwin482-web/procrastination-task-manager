import { Header } from '@/components/layout/header';
import { ChatInterface } from '@/components/chat/chat-interface';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
