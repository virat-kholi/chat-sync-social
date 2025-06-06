
import { User, Conversation, Message } from '@/store/useChatStore';

const API_BASE = '/api';

// Simulate API delay for realistic experience
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock session user (replace with actual session logic)
const mockSessionUser: User = {
  id: 1,
  name: 'Current User',
  email: 'current@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  isOnline: true
};

// Mock other users
const mockUsers: User[] = [
  {
    id: 2,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    isOnline: true
  },
  {
    id: 3,
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isOnline: true
  },
  {
    id: 4,
    name: 'Carol Davis',
    email: 'carol@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    isOnline: false
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isOnline: true
  }
];

// All users including session user
const allUsers = [mockSessionUser, ...mockUsers];

let mockConversations: Conversation[] = [];
let mockMessages: Message[] = [];

// Initialize mock data
const initializeMockData = () => {
  // Create some 1-on-1 conversations
  mockConversations = [
    {
      id: 'conv-1',
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      lastMessageAt: new Date(Date.now() - 3600000), // 1 hour ago
      users: [mockSessionUser, mockUsers[0]], // Only 2 users (1-on-1)
      messages: []
    },
    {
      id: 'conv-2',
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      lastMessageAt: new Date(Date.now() - 7200000), // 2 hours ago
      users: [mockSessionUser, mockUsers[1]], // Only 2 users (1-on-1)
      messages: []
    }
  ];

  // Create mock messages for 1-on-1 conversations
  mockMessages = [
    {
      id: 'msg-1',
      body: 'Hey! How are you doing today?',
      createdAt: new Date(Date.now() - 3600000),
      conversationId: 'conv-1',
      senderId: 2,
      sender: mockUsers[0],
      seen: [mockSessionUser]
    },
    {
      id: 'msg-2',
      body: 'I\'m doing great! Just working on some new projects.',
      createdAt: new Date(Date.now() - 3000000),
      conversationId: 'conv-1',
      senderId: 1,
      sender: mockSessionUser,
      seen: [mockUsers[0]]
    },
    {
      id: 'msg-3',
      body: 'That sounds exciting! Would love to hear more about it.',
      createdAt: new Date(Date.now() - 2400000),
      conversationId: 'conv-1',
      senderId: 2,
      sender: mockUsers[0],
      seen: []
    },
    {
      id: 'msg-4',
      body: 'Let\'s catch up later today!',
      createdAt: new Date(Date.now() - 1800000),
      conversationId: 'conv-1',
      senderId: 1,
      sender: mockSessionUser,
      seen: [mockUsers[0]]
    },
    {
      id: 'msg-5',
      body: 'Perfect! Looking forward to our conversation.',
      createdAt: new Date(Date.now() - 7200000),
      conversationId: 'conv-2',
      senderId: 3,
      sender: mockUsers[1],
      seen: [mockSessionUser]
    }
  ];
};

initializeMockData();

export const apiClient = {
  // Session-based current user
  async getCurrentUserFromSession(): Promise<User> {
    await delay(300);
    // In real app, this would get user from session/auth context
    return mockSessionUser;
  },

  // Users (excluding current user)
  async getUsers(): Promise<User[]> {
    await delay(500);
    return mockUsers; // Only other users, not session user
  },

  // Conversations (1-on-1 only)
  async getConversations(): Promise<Conversation[]> {
    await delay(800);
    return mockConversations.map(conv => ({
      ...conv,
      lastMessage: mockMessages
        .filter(msg => msg.conversationId === conv.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
    })).sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
  },

  // Create or get 1-on-1 conversation
  async createOrGetConversation(userId1: number, userId2: number): Promise<Conversation> {
    await delay(600);
    
    // Check if conversation already exists between these 2 users
    const existing = mockConversations.find(conv =>
      conv.users.length === 2 &&
      conv.users.some(u => u.id === userId1) && 
      conv.users.some(u => u.id === userId2)
    );

    if (existing) {
      return existing;
    }

    // Create new 1-on-1 conversation
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      createdAt: new Date(),
      lastMessageAt: new Date(),
      users: [
        allUsers.find(u => u.id === userId1)!,
        allUsers.find(u => u.id === userId2)!
      ],
      messages: []
    };

    mockConversations.push(newConversation);
    return newConversation;
  },

  // Messages
  async getMessages(conversationId: string): Promise<Message[]> {
    await delay(700);
    return mockMessages
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  async sendMessage(conversationId: string, senderId: number, body: string, image?: string, doc?: string): Promise<Message> {
    await delay(400);
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      body,
      image,
      doc,
      createdAt: new Date(),
      conversationId,
      senderId,
      sender: allUsers.find(u => u.id === senderId)!,
      seen: []
    };

    mockMessages.push(newMessage);

    // Update conversation's lastMessageAt
    const convIndex = mockConversations.findIndex(c => c.id === conversationId);
    if (convIndex !== -1) {
      mockConversations[convIndex].lastMessageAt = new Date();
    }

    return newMessage;
  },

  async markMessagesAsSeen(messageIds: string[], userId: number): Promise<void> {
    await delay(200);
    
    mockMessages.forEach(msg => {
      if (messageIds.includes(msg.id) && !msg.seen.some(u => u.id === userId)) {
        msg.seen.push(allUsers.find(u => u.id === userId)!);
      }
    });
  }
};
