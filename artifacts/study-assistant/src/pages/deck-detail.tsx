import React, { useState } from 'react';
import { useGetDeck, useCreateCard, useUpdateCard, useDeleteCard, getGetDeckQueryKey } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2, Edit, Play, CheckCircle, Circle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DeckDetail() {
  const { id } = useParams();
  const deckId = parseInt(id || '0', 10);
  
  const { data: deck, isLoading } = useGetDeck(deckId, { 
    query: { enabled: !!deckId, queryKey: getGetDeckQueryKey(deckId) } 
  });
  
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState({ id: 0, front: '', back: '' });
  
  const handleAddCard = () => {
    if (!currentCard.front || !currentCard.back) return;
    
    createCard.mutate({ 
      deckId, 
      data: { front: currentCard.front, back: currentCard.back } 
    }, {
      onSuccess: () => {
        setIsAddCardOpen(false);
        setCurrentCard({ id: 0, front: '', back: '' });
        queryClient.invalidateQueries({ queryKey: getGetDeckQueryKey(deckId) });
        toast({ title: "Card added", description: "Successfully added to the deck." });
      }
    });
  };

  const handleEditCard = () => {
    if (!currentCard.front || !currentCard.back || !currentCard.id) return;
    
    updateCard.mutate({ 
      id: currentCard.id, 
      data: { front: currentCard.front, back: currentCard.back } 
    }, {
      onSuccess: () => {
        setIsEditCardOpen(false);
        setCurrentCard({ id: 0, front: '', back: '' });
        queryClient.invalidateQueries({ queryKey: getGetDeckQueryKey(deckId) });
        toast({ title: "Card updated" });
      }
    });
  };

  const openEditModal = (card: any) => {
    setCurrentCard({ id: card.id, front: card.front, back: card.back });
    setIsEditCardOpen(true);
  };

  const openAddModal = () => {
    setCurrentCard({ id: 0, front: '', back: '' });
    setIsAddCardOpen(true);
  };

  const handleDeleteCard = (cardId: number) => {
    if (confirm("Delete this card?")) {
      deleteCard.mutate({ id: cardId }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetDeckQueryKey(deckId) });
        }
      });
    }
  };

  const toggleMastery = (cardId: number, currentMastered: boolean) => {
    updateCard.mutate({ 
      id: cardId, 
      data: { mastered: !currentMastered } 
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetDeckQueryKey(deckId) });
      }
    });
  };

  if (isLoading) {
    return <div className="p-8 animate-pulse flex flex-col gap-6">
      <div className="h-8 bg-muted rounded w-32"></div>
      <div className="h-16 bg-muted rounded w-3/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-muted rounded-xl"></div>)}
      </div>
    </div>;
  }

  if (!deck) return <div>Deck not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/decks" className="hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Decks
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">{deck.name}</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">{deck.description || "No description provided."}</p>
          
          <div className="flex items-center gap-6 mt-6">
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{deck.cardCount}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Cards</span>
            </div>
            <div className="h-10 w-px bg-border"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-accent">{deck.masteredCount}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Mastered</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" onClick={openAddModal} className="gap-2">
                <Plus className="h-4 w-4" /> Add Cards
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Card</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Front (Question)</Label>
                  <Textarea 
                    placeholder="e.g. What is the powerhouse of the cell?" 
                    value={currentCard.front}
                    onChange={(e) => setCurrentCard({ ...currentCard, front: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Back (Answer)</Label>
                  <Textarea 
                    placeholder="e.g. Mitochondria" 
                    value={currentCard.back}
                    onChange={(e) => setCurrentCard({ ...currentCard, back: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCardOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCard} disabled={!currentCard.front || !currentCard.back || createCard.isPending}>
                  {createCard.isPending ? "Adding..." : "Add Card"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Link href={`/quiz/${deck.id}`}>
            <Button className="gap-2 w-full sm:w-auto" size="lg" disabled={deck.cards.length === 0}>
              <Play className="h-5 w-5" /> Start Quiz
            </Button>
          </Link>
        </div>
      </div>

      <Dialog open={isEditCardOpen} onOpenChange={setIsEditCardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Front (Question)</Label>
              <Textarea 
                value={currentCard.front}
                onChange={(e) => setCurrentCard({ ...currentCard, front: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Back (Answer)</Label>
              <Textarea 
                value={currentCard.back}
                onChange={(e) => setCurrentCard({ ...currentCard, back: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCardOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCard} disabled={!currentCard.front || !currentCard.back || updateCard.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div>
        <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">Cards in this deck</h2>
        
        {!deck.cards.length ? (
          <div className="py-16 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <p className="mb-4">No cards in this deck yet.</p>
            <Button variant="outline" onClick={openAddModal}>Add your first card</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deck.cards.map((card) => (
              <Card key={card.id} className={`group relative overflow-hidden transition-all duration-300 ${card.mastered ? 'border-accent/50 bg-accent/5' : 'border-border'}`}>
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <button 
                      onClick={() => toggleMastery(card.id, card.mastered)}
                      className={`transition-colors p-1 -ml-1 rounded-md hover:bg-muted ${card.mastered ? 'text-accent' : 'text-muted-foreground'}`}
                      title={card.mastered ? "Mark as not mastered" : "Mark as mastered"}
                    >
                      {card.mastered ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </button>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => openEditModal(card)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteCard(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center gap-4 py-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium tracking-wide uppercase">Front</p>
                      <p className="font-medium text-sm leading-relaxed">{card.front}</p>
                    </div>
                    <div className="h-px w-full bg-border/50"></div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium tracking-wide uppercase">Back</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{card.back}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}