import React, { useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import { Sidebar } from '@/components/layout/Sidebar';
import Dashboard from '@/pages/dashboard';
import Subjects from '@/pages/subjects';
import Decks from '@/pages/decks';
import DeckDetail from '@/pages/deck-detail';
import Quiz from '@/pages/quiz';
import ChatList from '@/pages/chat-list';
import ChatDetail from '@/pages/chat-detail';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Sidebar>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/subjects" component={Subjects} />
        <Route path="/decks" component={Decks} />
        <Route path="/decks/:id" component={DeckDetail} />
        <Route path="/quiz/:deckId" component={Quiz} />
        <Route path="/chat" component={ChatList} />
        <Route path="/chat/:id" component={ChatDetail} />
        <Route component={NotFound} />
      </Switch>
    </Sidebar>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;