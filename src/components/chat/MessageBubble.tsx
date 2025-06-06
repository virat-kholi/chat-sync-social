
import { type Message } from '@/store/useChatStore';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  showTimestamp?: boolean;
}

export const MessageBubble = ({ 
  message, 
  isOwnMessage, 
  isFirstInGroup, 
  isLastInGroup,
  showTimestamp = false 
}: MessageBubbleProps) => {
  const isOptimistic = message.id.startsWith('temp-');

  return (
    <div className={cn(
      "group relative",
      isOwnMessage ? "flex justify-end" : "flex justify-start"
    )}>
      <div className={cn(
        "relative max-w-full break-words px-4 py-2 rounded-2xl transition-all duration-200",
        isOwnMessage 
          ? "bg-chat-message-own text-primary-foreground" 
          : "bg-chat-message-other text-foreground",
        
        // Rounded corners based on position in group
        isOwnMessage ? [
          isFirstInGroup && "rounded-tr-md",
          isLastInGroup && "rounded-br-md"
        ] : [
          isFirstInGroup && "rounded-tl-md",
          isLastInGroup && "rounded-bl-md"
        ],
        
        // Optimistic message styling
        isOptimistic && "opacity-70",
        
        // Hover effects
        "hover:scale-[1.02] hover:shadow-md"
      )}>
        {/* Message content */}
        {message.body && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.body}
          </p>
        )}

        {/* Image attachment */}
        {message.image && (
          <div className="mt-2">
            <img
              src={message.image}
              alt="Shared image"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}

        {/* Document attachment */}
        {message.doc && (
          <div className="mt-2 flex items-center space-x-2 p-2 bg-background/10 rounded-lg">
            <FileText size={16} />
            <span className="text-sm">Document attachment</span>
          </div>
        )}

        {/* Timestamp on hover or when specified */}
        {(showTimestamp || false) && (
          <div className={cn(
            "text-xs mt-1 opacity-70",
            isOwnMessage ? "text-right" : "text-left"
          )}>
            {formatDistanceToNow(message.createdAt, { addSuffix: true })}
          </div>
        )}
      </div>

      {/* Timestamp tooltip on hover */}
      <div className={cn(
        "absolute top-0 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10",
        isOwnMessage ? "right-full mr-2" : "left-full ml-2"
      )}>
        {formatDistanceToNow(message.createdAt, { addSuffix: true })}
      </div>
    </div>
  );
};
