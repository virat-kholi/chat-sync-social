
import { useChatStore } from '@/store/useChatStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ChatHeader = () => {
  const { 
    conversations, 
    activeConversationId, 
    currentUser, 
    onlineUsers,
    setActiveConversation 
  } = useChatStore();

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const otherUser = activeConversation?.users.find(user => user.id !== currentUser?.id);
  const isOnline = otherUser && onlineUsers.has(otherUser.id);

  if (!activeConversation || !otherUser) {
    return null;
  }

  return (
    <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Mobile back button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setActiveConversation(null)}
        >
          <ArrowLeft size={20} />
        </Button>

        <div className="flex items-center space-x-3">
          <div className="relative">
            {otherUser.avatar ? (
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {otherUser.name.charAt(0)}
              </div>
            )}
            
            {/* Online indicator */}
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-chat-online rounded-full border-2 border-card" />
            )}
          </div>

          <div>
            <h2 className="font-semibold text-foreground">{otherUser.name}</h2>
            <div className="flex items-center space-x-2">
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs px-2 py-0.5",
                  isOnline 
                    ? "bg-chat-online/10 text-chat-online border-chat-online/20" 
                    : "bg-chat-offline/10 text-chat-offline border-chat-offline/20"
                )}
              >
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Phone size={18} />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Video size={18} />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <MoreVertical size={18} />
        </Button>
      </div>
    </div>
  );
};
