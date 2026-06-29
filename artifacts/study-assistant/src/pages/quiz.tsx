import React, { useState, useEffect } from 'react';
import { useGetDeck, useUpdateCard, useCreateStudySession, getGetDeckQueryKey } from '@workspace/api-client-react';
import { useParams, Link, useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, RotateCw, X, Check, Award, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Quiz() {
  const { deckId } = useParams();
  const id = parseInt(deckId || '0', 10);
  const [, setLocation] = useLocation();
  
  const { data: deck, isLoading } = useGetDeck(id, { 
    query: { enabled: !!id, queryKey: getGetDeckQueryKey(id) } 
  });
  
  const updateCard = useUpdateCard();
  const createSession = useCreateStudySession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (deck?.cards) {
      // Shuffle cards for quiz
      const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setStartTime(Date.now());
    }
  }, [deck]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (correct: boolean) => {
    const currentCard = cards[currentIndex];
    
    // Update mastery stat silently in background if correct
    if (correct && !currentCard.mastered) {
      updateCard.mutate({ 
        id: currentCard.id, 
        data: { mastered: true } 
      });
    }

    setResults(prev => ({
      ...prev,
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (!correct ? 1 : 0)
    }));

    setIsFlipped(false);
    
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz(correct);
    }
  };

  const finishQuiz = (lastAnswerCorrect: boolean) => {
    setIsFinished(true);
    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
    const finalCorrect = results.correct + (lastAnswerCorrect ? 1 : 0);
    
    createSession.mutate({
      data: {
        deckId: id,
        cardsReviewed: cards.length,
        correctCount: finalCorrect,
        durationSeconds
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetDeckQueryKey(id) });
        toast({ title: "Session recorded", description: "Your study progress has been saved." });
      }
    });
  };

  if (isLoading || !deck) {
    return <div className="p-8 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>;
  }

  if (cards.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-serif mb-4">No cards in this deck</h2>
        <Link href={`/decks/${id}`}>
          <Button>Go back and add cards</Button>
        </Link>
      </div>
    );
  }

  if (isFinished) {
    const durationMinutes = Math.max(1, Math.floor((Date.now() - startTime) / 60000));
    const accuracy = Math.round((results.correct / cards.length) * 100);
    
    return (
      <div className="max-w-2xl mx-auto py-12 animate-in zoom-in-95 duration-500">
        <Card className="border-primary/20 shadow-lg text-center overflow-hidden">
          <div className="bg-primary/5 py-12 px-6 border-b border-border">
            <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground text-lg">{deck.name}</p>
          </div>
          
          <CardContent className="p-8 grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Accuracy</span>
              <span className={`text-4xl font-bold ${accuracy >= 80 ? 'text-green-500' : accuracy >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                {accuracy}%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Cards</span>
              <span className="text-4xl font-bold text-foreground">{cards.length}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Time</span>
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-muted-foreground" />
                <span className="text-4xl font-bold text-foreground">{durationMinutes}m</span>
              </div>
            </div>
          </CardContent>
          
          <div className="p-6 bg-muted/30 border-t border-border flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setLocation(`/decks/${id}`)}>
              Back to Deck
            </Button>
            <Button onClick={() => window.location.reload()}>
              Study Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex) / cards.length) * 100;

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col pb-8">
      <div className="flex items-center justify-between mb-8">
        <Link href={`/decks/${id}`} className="text-muted-foreground hover:text-foreground">
          <Button variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1 px-8">
          <Progress value={progress} className="h-2" />
        </div>
        <span className="text-sm font-medium tabular-nums text-muted-foreground">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col relative perspective-[1000px]">
        <div 
          className={`flex-1 w-full relative transition-all duration-500 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <Card className={`absolute inset-0 backface-hidden border-2 flex flex-col items-center justify-center p-8 sm:p-12 text-center hover:shadow-md transition-shadow ${isFlipped ? 'pointer-events-none' : ''}`}>
            <span className="absolute top-4 left-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded">Question</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif leading-relaxed">
              {currentCard.front}
            </h2>
            <div className="absolute bottom-6 flex flex-col items-center text-muted-foreground animate-pulse">
              <RotateCw className="h-5 w-5 mb-2" />
              <span className="text-xs font-medium uppercase tracking-wider">Tap to flip</span>
            </div>
          </Card>

          {/* Back of card */}
          <Card className={`absolute inset-0 backface-hidden rotate-y-180 border-2 border-primary/30 bg-primary/5 flex flex-col items-center justify-center p-8 sm:p-12 text-center ${!isFlipped ? 'pointer-events-none' : ''}`}>
             <span className="absolute top-4 left-4 text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">Answer</span>
             <div className="text-xl sm:text-2xl leading-relaxed text-foreground whitespace-pre-wrap">
              {currentCard.back}
            </div>
          </Card>
        </div>

        {/* Action buttons (only show when flipped) */}
        <div className={`mt-8 flex justify-center gap-4 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <Button 
            size="lg" 
            variant="outline" 
            className="flex-1 max-w-[200px] h-16 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
            onClick={(e) => { e.stopPropagation(); handleAnswer(false); }}
          >
            <X className="mr-2 h-5 w-5" /> Still learning
          </Button>
          <Button 
            size="lg" 
            className="flex-1 max-w-[200px] h-16 bg-green-500 hover:bg-green-600 text-white"
            onClick={(e) => { e.stopPropagation(); handleAnswer(true); }}
          >
            <Check className="mr-2 h-5 w-5" /> Got it
          </Button>
        </div>
      </div>
    </div>
  );
}