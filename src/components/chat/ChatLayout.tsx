
import { useState, useEffect } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import { WelcomeScreen } from './WelcomeScreen';
import { useChatStore } from '@/store/useChatStore';
import { cn } from '@/lib/utils';

export const ChatLayout = () => {
  const { activeConversationId, sidebarCollapsed } = useChatStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <div className={cn(
        "bg-chat-sidebar border-r border-border transition-all duration-300 ease-in-out",
        isMobile 
          ? "absolute inset-y-0 left-0 z-40 w-80 transform" 
          : "relative",
        sidebarCollapsed && !isMobile ? "w-0" : "w-80",
        isMobile && activeConversationId ? "-translate-x-full" : "translate-x-0"
      )}>
        <ChatSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeConversationId ? (
          <ChatWindow />
        ) : (
          <WelcomeScreen />
        )}
      </div>

      {/* Mobile overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="absolute inset-0 bg-black/20 z-30"
          onClick={() => useChatStore.getState().toggleSidebar()}
        />
      )}
    </div>
  );
};
