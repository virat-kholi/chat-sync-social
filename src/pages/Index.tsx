
import { useEffect } from 'react';
import { ChatLayout } from '@/components/chat/ChatLayout';
import { useChatStore } from '@/store/useChatStore';
import { useCurrentUser, useUsers } from '@/hooks/useApiHooks';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { setCurrentUser, setUsers, setOnlineUsers } = useChatStore();
  
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { data: users, isLoading: isLoadingUsers } = useUsers();

  useEffect(() => {
    if (currentUser) {
      setCurrentUser(currentUser);
    }
  }, [currentUser, setCurrentUser]);

  useEffect(() => {
    if (users) {
      setUsers(users);
      // Mock some users as online
      const onlineUserIds = users
        .filter(user => user.isOnline)
        .map(user => user.id);
      setOnlineUsers(onlineUserIds);
    }
  }, [users, setUsers, setOnlineUsers]);

  if (isLoadingUser || isLoadingUsers) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="w-80 bg-chat-sidebar border-r border-border p-4">
          <Skeleton className="h-8 mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b border-border flex items-center px-6">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex-1 p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-10 w-64" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ChatLayout />
    </div>
  );
};

export default Index;
