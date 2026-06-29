import React, { useState } from 'react';
import { useGetDashboardStats, getGetDashboardStatsQueryKey } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Brain, Layers, Clock, CheckCircle, GraduationCap } from 'lucide-react';
import { Link } from 'wouter';

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats({ query: { queryKey: getGetDashboardStatsQueryKey() } });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-muted rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-xl"></div>)}
        </div>
        <div className="h-64 bg-muted rounded-xl"></div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Decks',
      value: stats.totalDecks,
      icon: Layers,
      color: 'text-blue-500',
    },
    {
      title: 'Cards Mastered',
      value: `${stats.masteredCards} / ${stats.totalCards}`,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      title: 'Study Sessions',
      value: stats.totalSessions,
      icon: Brain,
      color: 'text-accent',
    },
    {
      title: 'Minutes Studied',
      value: stats.totalStudyMinutes,
      icon: Clock,
      color: 'text-purple-500',
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground mt-2">Ready to master some new concepts today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Subject Breakdown</CardTitle>
            <CardDescription>Cards across your different subjects</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.subjectBreakdown.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.subjectBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="subjectName" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar dataKey="cardCount" name="Total Cards" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="masteredCount" name="Mastered" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border rounded-lg">
                <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-serif text-xl font-medium mb-2">No subjects yet</h3>
                <p className="text-muted-foreground mb-4">Start by creating a subject and adding some flashcards.</p>
                <Link href="/subjects" className="text-primary hover:underline font-medium">
                  Create a Subject
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your latest study activity</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentSessions.length > 0 ? (
              <div className="space-y-4">
                {stats.recentSessions.map((session) => (
                  <div key={session.id} className="flex flex-col p-3 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{session.deckName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(session.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {session.cardsReviewed} cards
                      </span>
                      <span className="text-primary font-medium">
                        {Math.round((session.correctCount / Math.max(1, session.cardsReviewed)) * 100)}% accuracy
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Clock className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">No study sessions recorded yet.</p>
                <Link href="/decks" className="text-primary hover:underline text-sm font-medium mt-2">
                  Start studying
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}