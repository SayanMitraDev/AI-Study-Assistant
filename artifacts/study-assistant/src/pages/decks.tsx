import React, { useState } from 'react';
import { useListDecks, useCreateDeck, useDeleteDeck, useListSubjects, getListDecksQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layers, Plus, Trash2, Play, LayoutGrid } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Decks() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const subjectIdParam = searchParams.get('subjectId');
  const subjectId = subjectIdParam ? parseInt(subjectIdParam, 10) : undefined;
  
  const { data: decks, isLoading } = useListDecks(
    { subjectId }, 
    { query: { queryKey: getListDecksQueryKey({ subjectId }) } }
  );
  const { data: subjects } = useListSubjects();
  
  const createDeck = useCreateDeck();
  const deleteDeck = useDeleteDeck();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newDeck, setNewDeck] = useState({ name: '', description: '', subjectId: subjectId || undefined });

  const handleCreate = () => {
    if (!newDeck.name) return;
    
    createDeck.mutate({ data: newDeck }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNewDeck({ name: '', description: '', subjectId: undefined });
        queryClient.invalidateQueries({ queryKey: getListDecksQueryKey() });
        if (subjectId) {
          queryClient.invalidateQueries({ queryKey: getListDecksQueryKey({ subjectId }) });
        }
        toast({ title: "Deck created", description: "Your new deck is ready for cards." });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this deck and all its cards?")) {
      deleteDeck.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDecksQueryKey() });
          if (subjectId) {
            queryClient.invalidateQueries({ queryKey: getListDecksQueryKey({ subjectId }) });
          }
          toast({ title: "Deck deleted", description: "The deck has been removed." });
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-56 bg-muted rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  const activeSubject = subjects?.find(s => s.id === subjectId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground">
            {activeSubject ? `${activeSubject.name} Decks` : 'All Flashcards'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {activeSubject ? `Viewing decks in ${activeSubject.name}` : 'Browse all your study decks across subjects.'}
          </p>
        </div>
        
        <div className="flex gap-2">
          {subjectId && (
            <Link href="/decks">
              <Button variant="outline">View All</Button>
            </Link>
          )}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Deck
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Deck</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Deck Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Chapter 1 Vocabulary" 
                    value={newDeck.name}
                    onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    placeholder="What is this deck about?" 
                    value={newDeck.description}
                    onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={newDeck.subjectId?.toString() || ""} 
                    onValueChange={(val) => setNewDeck({ ...newDeck, subjectId: val ? parseInt(val, 10) : undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects?.map(s => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!newDeck.name || createDeck.isPending}>
                  {createDeck.isPending ? "Creating..." : "Create Deck"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!decks?.length ? (
        <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-xl bg-card">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Layers className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-serif text-2xl font-semibold mb-2">No decks found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Create a deck to start adding flashcards and studying.
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>Create your first deck</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck, i) => {
            const subject = subjects?.find(s => s.id === deck.subjectId);
            const progress = deck.cardCount > 0 ? (deck.masteredCount / deck.cardCount) * 100 : 0;
            
            return (
              <Card key={deck.id} className="flex flex-col h-full overflow-hidden border-border/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: `${i * 50}ms` }}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded-md" 
                      style={{ 
                        backgroundColor: subject ? `${subject.color}20` : 'var(--muted)',
                        color: subject ? subject.color : 'var(--muted-foreground)'
                      }}
                    >
                      {subject?.name || 'Uncategorized'}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(deck.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl line-clamp-1">{deck.name}</CardTitle>
                  <CardDescription className="line-clamp-2 h-10 mt-2">
                    {deck.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <LayoutGrid className="h-4 w-4" />
                        <span>{deck.cardCount} Cards</span>
                      </div>
                      <span className="font-medium text-primary">
                        {deck.masteredCount} Mastered
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-accent h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 gap-2">
                  <Link href={`/decks/${deck.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">Manage</Button>
                  </Link>
                  <Link href={`/quiz/${deck.id}`} className="flex-1">
                    <Button className="w-full gap-2" disabled={deck.cardCount === 0}>
                      <Play className="h-4 w-4" /> Study
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}