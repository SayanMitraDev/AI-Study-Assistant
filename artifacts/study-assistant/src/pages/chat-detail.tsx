import React, { useState, useEffect, useRef } from 'react';
import { useGetOpenaiConversation, getGetOpenaiConversationQueryKey } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Sparkles, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatDetail() {
  const { id } = useParams();
  const conversationId = parseInt(id || '0', 10);
  
  const { data: conversation, isLoading } = useGetOpenaiConversation(conversationId, { 
    query: { enabled: !!conversationId, queryKey: getGetOpenaiConversationQueryKey(conversationId) } 
  });
  
  const queryClient = useQueryClient();
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, streamedResponse]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    
    const userMessage = input;
    setInput('');
    setIsStreaming(true);
    setStreamedResponse('');

    // Optimistically add user message to cache
    if (conversation) {
      const oldData = queryClient.getQueryData<any>(getGetOpenaiConversationQueryKey(conversationId));
      queryClient.setQueryData(getGetOpenaiConversationQueryKey(conversationId), {
        ...oldData,
        messages: [
          ...oldData.messages,
          { id: Date.now(), role: 'user', content: userMessage, createdAt: new Date().toISOString() }
        ]
      });
    }

    try {
      const response = await fetch(`/api/openai/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userMessage })
      });

      if (!response.ok) throw new Error('Failed to send message');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Append decoded chunk to buffer (stream:true handles multi-byte chars)
        buffer += decoder.decode(value, { stream: true });

        // Process all complete SSE events (terminated by double newline)
        const events = buffer.split('\n\n');
        // Last element may be incomplete; keep it in the buffer
        buffer = events.pop() ?? '';

        for (const event of events) {
          // Each event may have multiple lines; find the data line
          for (const line of event.split('\n')) {
            if (!line.startsWith('data: ')) continue;
            const dataStr = line.slice('data: '.length).trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.done) {
                setIsStreaming(false);
                queryClient.invalidateQueries({ queryKey: getGetOpenaiConversationQueryKey(conversationId) });
              } else if (data.content) {
                setStreamedResponse(prev => prev + data.content);
              }
            } catch {
              // incomplete JSON — shouldn't happen with double-newline splitting
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setIsStreaming(false);
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: getGetOpenaiConversationQueryKey(conversationId) });
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!conversation) return <div>Conversation not found</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto border border-border bg-card rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="h-16 px-6 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="font-semibold text-foreground truncate">{conversation.title}</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1.5 rounded-full">
          <Sparkles className="h-3.5 w-3.5" /> AI Tutor
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {conversation.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-70">
            <Sparkles className="h-12 w-12 text-primary mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">How can I help you study today?</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Ask me to explain a concept, quiz you on a topic, or help you brainstorm mnemonic devices.
            </p>
          </div>
        ) : (
          conversation.messages.map((msg, i) => (
            <div key={msg.id || i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 ${
                msg.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'
              }`}>
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                msg.role === 'user' 
                  ? 'bg-secondary text-secondary-foreground rounded-tr-sm' 
                  : 'bg-muted/50 border border-border/50 rounded-tl-sm text-foreground prose prose-sm prose-p:leading-relaxed dark:prose-invert max-w-[85%]'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </div>
            </div>
          ))
        )}

        {/* Streaming active response */}
        {isStreaming && (
          <div className="flex gap-4">
            <div className="shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mt-1">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-5 py-3.5 bg-muted/50 border border-border/50 text-foreground prose prose-sm prose-p:leading-relaxed dark:prose-invert">
              <ReactMarkdown>{streamedResponse}</ReactMarkdown>
              {!streamedResponse && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card shrink-0">
        <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
          <Textarea
            ref={textareaRef}
            placeholder="Ask your tutor something..."
            className="min-h-[60px] max-h-[200px] resize-none pb-3 pr-12 rounded-xl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
          />
          <Button 
            size="icon" 
            className="absolute right-2 bottom-2 h-8 w-8 rounded-lg"
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
          >
            {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          AI can make mistakes. Verify important facts with your study materials.
        </p>
      </div>
    </div>
  );
}