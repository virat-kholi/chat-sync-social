
import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { MessageBubble } from './MessageBubble';
import { MessageGroup } from './MessageGroup';
import { groupMessagesBySender } from '@/lib/messageUtils';
import { useMarkMessagesAsSeen } from '@/hooks/useApiHooks';
import { ScrollArea } from '@/components/ui/scroll-area';

export const MessageList = () => {
  const { 
    activeConversationId, 
    messagesByConversation, 
    currentUser 
  } = useChatStore();
  
  const markSeenMutation = useMarkMessagesAsSeen();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const messages = activeConversationId ? messagesByConversation[activeConversationId] || [] : [];
  const messageGroups = groupMessagesBySender(messages);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  useEffect(() => {
    // Mark messages as seen when they come into view
    if (!currentUser || !activeConversationId) return;

    const unseenMessageIds = messages
      .filter(msg => 
        msg.senderId !== currentUser.id && 
        !msg.seen.some(user => user.id === currentUser.id)
      )
      .map(msg => msg.id);

    if (unseenMessageIds.length > 0) {
      markSeenMutation.mutate({ messageIds: unseenMessageIds });
    }
  }, [messages, currentUser, activeConversationId, markSeenMutation]);

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <div>
            <p className="font-medium text-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">
              Start the conversation by sending a message below
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div ref={containerRef} className="p-6 space-y-6 custom-scrollbar">
        {messageGroups.map((group, groupIndex) => (
          <MessageGroup
            key={`${group.senderId}-${group.messages[0].id}`}
            group={group}
            isOwnMessage={group.senderId === currentUser?.id}
            showSenderInfo={group.senderId !== currentUser?.id}
          />
        ))}
        <div ref={lastMessageRef} />
      </div>
    </ScrollArea>
  );
};
