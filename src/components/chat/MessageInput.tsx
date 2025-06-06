
import { useState, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useSendMessage } from '@/hooks/useApiHooks';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Image as ImageIcon, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { activeConversationId } = useChatStore();
  const sendMessageMutation = useSendMessage();

  const handleSend = () => {
    if (!message.trim() || !activeConversationId) return;

    sendMessageMutation.mutate({
      conversationId: activeConversationId,
      body: message.trim()
    });

    setMessage('');
    setIsExpanded(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 120; // Max 5 lines approximately
    
    if (scrollHeight > 40) {
      setIsExpanded(true);
      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    } else {
      setIsExpanded(false);
    }
  };

  const handleFileUpload = (type: 'image' | 'document') => {
    // Mock file upload - in real app, implement actual file upload
    console.log(`Uploading ${type}...`);
    // You would implement actual file upload logic here
  };

  return (
    <div className="border-t border-border bg-background">
      <div className="p-4">
        <div className={cn(
          "flex items-end space-x-3 p-3 bg-card rounded-2xl border transition-all duration-200",
          isExpanded && "items-start pt-4"
        )}>
          {/* Attachment buttons */}
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => handleFileUpload('document')}
            >
              <Paperclip size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => handleFileUpload('image')}
            >
              <ImageIcon size={18} />
            </Button>
          </div>

          {/* Message input */}
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className={cn(
                "min-h-[40px] max-h-[120px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0",
                "placeholder:text-muted-foreground"
              )}
              rows={1}
            />
          </div>

          {/* Emoji and send buttons */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Smile size={18} />
            </Button>
            
            <Button
              onClick={handleSend}
              disabled={!message.trim() || sendMessageMutation.isPending}
              size="icon"
              className={cn(
                "h-8 w-8 transition-all duration-200",
                message.trim() 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>

        {/* Typing indicator placeholder */}
        <div className="mt-2 text-xs text-muted-foreground h-4">
          {/* You can add typing indicators here */}
        </div>
      </div>
    </div>
  );
};
