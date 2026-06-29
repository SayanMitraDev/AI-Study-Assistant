import React from 'react';
import { Link, useLocation } from 'wouter';
import { BookOpen, Folders, BrainCircuit, MessageSquare, Menu, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/subjects', label: 'Subjects', icon: Folders },
    { href: '/decks', label: 'Flashcards', icon: BookOpen },
    { href: '/chat', label: 'AI Tutor', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <BrainCircuit className="h-6 w-6" />
            <span className="font-serif font-semibold text-lg tracking-tight">Study Assistant</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}>
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border">
          <div className="bg-muted/50 p-4 rounded-lg flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Keep up the momentum!</p>
            <div className="w-full bg-border h-2 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-2/3"></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Daily goal: 20 mins</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:hidden">
          <div className="flex items-center gap-2 text-primary">
            <BrainCircuit className="h-6 w-6" />
            <span className="font-serif font-semibold text-lg tracking-tight">Study Assistant</span>
          </div>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
