
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  body?: string;
  image?: string;
  doc?: string;
  createdAt: Date;
  conversationId: string;
  senderId: number;
  sender: User;
  seen: User[];
}

export interface Conversation {
  id: string;
  createdAt: Date;
  lastMessageAt: Date;
  name?: string;
  users: User[];
  messages: Message[];
  lastMessage?: Message;
}

interface ChatState {
  // Current user
  currentUser: User | null;
  
  // Users
  users: User[];
  onlineUsers: Set<number>;
  
  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  
  // Messages
  messagesByConversation: Record<string, Message[]>;
  
  // UI state
  sidebarCollapsed: boolean;
  isTyping: Record<string, number[]>; // conversationId -> userIds
  
  // Actions
  setCurrentUser: (user: User) => void;
  setUsers: (users: User[]) => void;
  setOnlineUsers: (userIds: number[]) => void;
  addOnlineUser: (userId: number) => void;
  removeOnlineUser: (userId: number) => void;
  
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  setActiveConversation: (id: string | null) => void;
  
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  addOptimisticMessage: (conversationId: string, message: Omit<Message, 'id'> & { id?: string }) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  markMessagesAsSeen: (conversationId: string, messageIds: string[], userId: number) => void;
  
  toggleSidebar: () => void;
  setTyping: (conversationId: string, userId: number, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentUser: null,
      users: [],
      onlineUsers: new Set(),
      conversations: [],
      activeConversationId: null,
      messagesByConversation: {},
      sidebarCollapsed: false,
      isTyping: {},

      // User actions
      setCurrentUser: (user) => set({ currentUser: user }),
      
      setUsers: (users) => set({ users }),
      
      setOnlineUsers: (userIds) => set({ onlineUsers: new Set(userIds) }),
      
      addOnlineUser: (userId) => set((state) => ({
        onlineUsers: new Set([...state.onlineUsers, userId])
      })),
      
      removeOnlineUser: (userId) => set((state) => {
        const newOnlineUsers = new Set(state.onlineUsers);
        newOnlineUsers.delete(userId);
        return { onlineUsers: newOnlineUsers };
      }),

      // Conversation actions
      setConversations: (conversations) => set({ conversations }),
      
      addConversation: (conversation) => set((state) => ({
        conversations: [conversation, ...state.conversations]
      })),
      
      updateConversation: (id, updates) => set((state) => ({
        conversations: state.conversations.map(conv =>
          conv.id === id ? { ...conv, ...updates } : conv
        )
      })),
      
      setActiveConversation: (id) => set({ activeConversationId: id }),

      // Message actions
      setMessages: (conversationId, messages) => set((state) => ({
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: messages
        }
      })),
      
      addMessage: (conversationId, message) => set((state) => {
        const existingMessages = state.messagesByConversation[conversationId] || [];
        const messageExists = existingMessages.some(m => m.id === message.id);
        
        if (messageExists) {
          return state;
        }
        
        return {
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: [...existingMessages, message]
          }
        };
      }),
      
      addOptimisticMessage: (conversationId, message) => set((state) => {
        const optimisticMessage: Message = {
          ...message,
          id: message.id || `temp-${Date.now()}`,
          createdAt: new Date(),
          seen: []
        } as Message;
        
        const existingMessages = state.messagesByConversation[conversationId] || [];
        
        return {
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: [...existingMessages, optimisticMessage]
          }
        };
      }),
      
      updateMessage: (conversationId, messageId, updates) => set((state) => {
        const messages = state.messagesByConversation[conversationId] || [];
        return {
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: messages.map(msg =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            )
          }
        };
      }),
      
      markMessagesAsSeen: (conversationId, messageIds, userId) => set((state) => {
        const messages = state.messagesByConversation[conversationId] || [];
        return {
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: messages.map(msg =>
              messageIds.includes(msg.id) && !msg.seen.some(u => u.id === userId)
                ? { ...msg, seen: [...msg.seen, { id: userId } as User] }
                : msg
            )
          }
        };
      }),

      // UI actions
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      setTyping: (conversationId, userId, isTyping) => set((state) => {
        const currentTyping = state.isTyping[conversationId] || [];
        let newTyping;
        
        if (isTyping) {
          newTyping = currentTyping.includes(userId) 
            ? currentTyping 
            : [...currentTyping, userId];
        } else {
          newTyping = currentTyping.filter(id => id !== userId);
        }
        
        return {
          isTyping: {
            ...state.isTyping,
            [conversationId]: newTyping
          }
        };
      })
    }),
    { name: 'chat-store' }
  )
);
