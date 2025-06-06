
import { type MessageGroup as MessageGroupType } from '@/lib/messageUtils';
import { MessageBubble } from './MessageBubble';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface MessageGroupProps {
  group: MessageGroupType;
  isOwnMessage: boolean;
  showSenderInfo: boolean;
}

export const MessageGroup = ({ group, isOwnMessage, showSenderInfo }: MessageGroupProps) => {
  const firstMessage = group.messages[0];
  const lastMessage = group.messages[group.messages.length - 1];

  return (
    <div className={cn(
      "flex space-x-3 animate-message-in",
      isOwnMessage ? "justify-end" : "justify-start"
    )}>
      {/* Avatar for other users */}
      {showSenderInfo && !isOwnMessage && (
        <div className="flex-shrink-0">
          {firstMessage.sender.avatar ? (
            <img
              src={firstMessage.sender.avatar}
              alt={firstMessage.sender.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
              {firstMessage.sender.name.charAt(0)}
            </div>
          )}
        </div>
      )}

      <div className={cn(
        "flex-1 max-w-xs sm:max-w-md space-y-1",
        isOwnMessage && "flex flex-col items-end"
      )}>
        {/* Sender name and timestamp */}
        {showSenderInfo && !isOwnMessage && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-foreground">
              {firstMessage.sender.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(firstMessage.createdAt, { addSuffix: true })}
            </span>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-1">
          {group.messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={isOwnMessage}
              isFirstInGroup={index === 0}
              isLastInGroup={index === group.messages.length - 1}
              showTimestamp={isOwnMessage && index === group.messages.length - 1}
            />
          ))}
        </div>

        {/* Seen indicators for own messages */}
        {isOwnMessage && lastMessage.seen.length > 0 && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
            <span>Seen by</span>
            <div className="flex -space-x-1">
              {lastMessage.seen.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="w-4 h-4 rounded-full border border-background overflow-hidden"
                  title={user.name}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                      {user.name?.charAt(0)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {lastMessage.seen.length > 3 && (
              <span>+{lastMessage.seen.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Avatar for own messages */}
      {isOwnMessage && (
        <div className="flex-shrink-0">
          {firstMessage.sender.avatar ? (
            <img
              src={firstMessage.sender.avatar}
              alt={firstMessage.sender.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
              {firstMessage.sender.name.charAt(0)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
