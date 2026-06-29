import React, { useState } from 'react';
import { useListSubjects, useCreateSubject, useDeleteSubject, getListSubjectsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Folder, Plus, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function Subjects() {
  const { data: subjects, isLoading } = useListSubjects({ query: { queryKey: getListSubjectsQueryKey() } });
  const createSubject = useCreateSubject();
  const deleteSubject = useDeleteSubject();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', color: '#5b4cff', icon: 'Folder' });

  const handleCreate = () => {
    if (!newSubject.name) return;
    
    createSubject.mutate({ data: newSubject }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNewSubject({ name: '', color: '#5b4cff', icon: 'Folder' });
        queryClient.invalidateQueries({ queryKey: getListSubjectsQueryKey() });
        toast({ title: "Subject created", description: "Your new subject has been added." });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      deleteSubject.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSubjectsQueryKey() });
          toast({ title: "Subject deleted", description: "The subject has been removed." });
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-muted rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground">Subjects</h1>
          <p className="text-muted-foreground mt-2">Organize your flashcards into categories.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Biology, Spanish, History" 
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Theme Color</Label>
                <div className="flex gap-2">
                  {['#5b4cff', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6', '#0ea5e9'].map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${newSubject.color === color ? 'border-primary scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewSubject({ ...newSubject, color })}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newSubject.name || createSubject.isPending}>
                {createSubject.isPending ? "Creating..." : "Create Subject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!subjects?.length ? (
        <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-xl bg-card">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Folder className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-serif text-2xl font-semibold mb-2">No subjects yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Subjects help you organize your study materials. Create your first subject to start building decks.
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>Create your first subject</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, i) => (
            <Card key={subject.id} className="group overflow-hidden border-border/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="h-2 w-full" style={{ backgroundColor: subject.color || 'var(--primary)' }}></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: `${subject.color}15`, color: subject.color }}>
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(subject.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl">{subject.name}</CardTitle>
              </CardHeader>
              <CardFooter className="pt-4 mt-auto">
                <Link href={`/decks?subjectId=${subject.id}`} className="w-full">
                  <Button variant="secondary" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View Decks
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}