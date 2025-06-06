
import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useMessages } from '@/hooks/useApiHooks';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Skeleton } from '@/components/ui/skeleton';

export const ChatWindow = () => {
  const { activeConversationId, setMessages } = useChatStore();
  const { data: messages, isLoading } = useMessages(activeConversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages && activeConversationId) {
      setMessages(activeConversationId, messages);
    }
  }, [messages, activeConversationId, setMessages]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeConversationId) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader />
      
      <div className="flex-1 flex flex-col min-h-0">
        {isLoading ? (
          <div className="flex-1 p-6 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`flex ${i % 3 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-start space-x-3 max-w-xs">
                  {i % 3 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className={`h-10 ${i % 2 === 0 ? 'w-48' : 'w-32'}`} />
                  </div>
                  {i % 3 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <MessageList />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};
