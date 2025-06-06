
import { MessageCircle, Users, Zap } from 'lucide-react';

export const WelcomeScreen = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
      <div className="max-w-md text-center space-y-8">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <MessageCircle size={40} className="text-primary" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome to ChatApp
            </h1>
            <p className="text-muted-foreground">
              Start a conversation by selecting a user from the sidebar or choose from your existing conversations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-card border">
            <Users size={20} className="text-primary" />
            <div className="text-left">
              <p className="font-medium">Browse Users</p>
              <p className="text-muted-foreground text-xs">Find people to chat with</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-card border">
            <MessageCircle size={20} className="text-primary" />
            <div className="text-left">
              <p className="font-medium">Recent Conversations</p>
              <p className="text-muted-foreground text-xs">Continue where you left off</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-card border">
            <Zap size={20} className="text-primary" />
            <div className="text-left">
              <p className="font-medium">Real-time Messaging</p>
              <p className="text-muted-foreground text-xs">Instant message delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
