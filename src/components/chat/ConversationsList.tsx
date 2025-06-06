
import { useChatStore, type Conversation } from '@/store/useChatStore';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ConversationsListProps {
  conversations: Conversation[];
  isLoading: boolean;
}

export const ConversationsList = ({ conversations, isLoading }: ConversationsListProps) => {
  const { activeConversationId, setActiveConversation, currentUser, onlineUsers } = useChatStore();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No conversations yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Start a conversation from the Users tab
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground mb-3 px-2">
        CONVERSATIONS ({conversations.length})
      </p>
      
      {conversations.map((conversation) => {
        // For 1-on-1 chats, get the other user
        const otherUser = conversation.users.find(user => user.id !== currentUser?.id);
        const isActive = activeConversationId === conversation.id;
        const isOnline = otherUser && onlineUsers.has(otherUser.id);
        
        return (
          <button
            key={conversation.id}
            onClick={() => setActiveConversation(conversation.id)}
            className={cn(
              "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200",
              isActive 
                ? "bg-primary/10 border border-primary/20" 
                : "hover:bg-chat-hover focus:bg-chat-hover",
              "focus:outline-none"
            )}
          >
            <div className="relative">
              {otherUser?.avatar ? (
                <img
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {otherUser?.name?.charAt(0) || '?'}
                </div>
              )}
              
              {/* Online indicator */}
              {isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-chat-online rounded-full border-2 border-chat-sidebar" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className={cn(
                  "font-medium text-sm truncate",
                  isActive && "text-primary"
                )}>
                  {otherUser?.name || 'Unknown User'}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(conversation.lastMessageAt, { addSuffix: true })}
                </span>
              </div>
              
              {conversation.lastMessage && (
                <p className="text-xs text-muted-foreground truncate">
                  {conversation.lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
                  {conversation.lastMessage.body || (conversation.lastMessage.image ? '📷 Image' : '📎 Document')}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
