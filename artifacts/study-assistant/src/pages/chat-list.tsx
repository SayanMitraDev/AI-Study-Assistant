import React, { useState } from 'react';
import { useListOpenaiConversations, useCreateOpenaiConversation, useDeleteOpenaiConversation, getListOpenaiConversationsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MessageSquare, Plus, Trash2, ChevronRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function ChatList() {
  const { data: conversations, isLoading } = useListOpenaiConversations({ 
    query: { queryKey: getListOpenaiConversationsQueryKey() } 
  });
  
  const createConversation = useCreateOpenaiConversation();
  const deleteConversation = useDeleteOpenaiConversation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');

  const handleCreate = () => {
    if (!title) return;
    
    createConversation.mutate({ data: { title } }, {
      onSuccess: (newConv) => {
        setIsCreateOpen(false);
        setTitle('');
        queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
        setLocation(`/chat/${newConv.id}`);
      }
    });
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // Prevent link click
    if (confirm("Delete this conversation?")) {
      deleteConversation.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
          toast({ title: "Conversation deleted" });
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted rounded w-1/4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 bg-primary/5 p-8 rounded-2xl border border-primary/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-lg text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">AI Study Tutor</h1>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Ask questions, explain concepts to test your understanding, or ask for mnemonic devices. Your tutor remembers your conversation history.
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 whitespace-nowrap">
              <Plus className="h-5 w-5" />
              New Conversation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a new study session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Topic or Goal</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Explain quantum physics, Spanish verb conjugation..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!title || createConversation.isPending}>
                {createConversation.isPending ? "Starting..." : "Start Chat"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">Recent Conversations</h2>
        
        {!conversations?.length ? (
          <div className="py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-xl">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-medium text-lg mb-1">No chats yet</h3>
            <p className="text-muted-foreground mb-4">Start a conversation to get help with your studies.</p>
            <Button variant="outline" onClick={() => setIsCreateOpen(true)}>Start Chat</Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {conversations.map((conv) => (
              <Link key={conv.id} href={`/chat/${conv.id}`}>
                <div className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {conv.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Started {formatDistanceToNow(new Date(conv.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                      onClick={(e) => handleDelete(e, conv.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}