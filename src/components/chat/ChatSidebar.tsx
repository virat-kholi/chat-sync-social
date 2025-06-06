
import { useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useConversations, useCreateOrGetConversation } from '@/hooks/useApiHooks';
import { UsersList } from './UsersList';
import { ConversationsList } from './ConversationsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Users, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ChatSidebar = () => {
  const { currentUser, sidebarCollapsed, toggleSidebar, setConversations } = useChatStore();
  const { data: conversations, isLoading } = useConversations();
  const createConversationMutation = useCreateOrGetConversation();

  useEffect(() => {
    if (conversations) {
      setConversations(conversations);
    }
  }, [conversations, setConversations]);

  const handleUserSelect = (userId: number) => {
    if (!currentUser) return;
    
    createConversationMutation.mutate({
      userId1: currentUser.id,
      userId2: userId
    });
  };

  if (sidebarCollapsed) {
    return (
      <div className="w-16 h-full bg-chat-sidebar border-r border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mb-4"
        >
          <Menu size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-chat-sidebar border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <p className="font-medium text-sm">{currentUser?.name}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <Menu size={16} />
          </Button>
        </div>

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageCircle size={16} />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="mt-4">
            <ConversationsList 
              conversations={conversations || []} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <UsersList onUserSelect={handleUserSelect} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
