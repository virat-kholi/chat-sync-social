
import { useChatStore } from '@/store/useChatStore';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface UsersListProps {
  onUserSelect: (userId: number) => void;
}

export const UsersList = ({ onUserSelect }: UsersListProps) => {
  const { users, onlineUsers } = useChatStore();

  if (!users.length) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground mb-3 px-2">
        USERS ({users.length})
      </p>
      
      {users.map((user) => {
        const isOnline = onlineUsers.has(user.id);
        
        return (
          <button
            key={user.id}
            onClick={() => onUserSelect(user.id)}
            className={cn(
              "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200",
              "hover:bg-chat-hover focus:bg-chat-hover focus:outline-none"
            )}
          >
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {user.name.charAt(0)}
                </div>
              )}
              
              {/* Online indicator */}
              <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-chat-sidebar",
                isOnline ? "bg-chat-online" : "bg-chat-offline"
              )} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm truncate">{user.name}</p>
                {isOnline && (
                  <Badge variant="secondary" className="text-xs bg-chat-online/10 text-chat-online border-chat-online/20">
                    Online
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
