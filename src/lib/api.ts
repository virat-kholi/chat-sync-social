
import { User, Conversation, Message } from '@/store/useChatStore';

const API_BASE = '/api';

// Simulate API delay for realistic experience
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for development
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Current User',
    email: 'current@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isOnline: true
  },
  {
    id: 2,
    name: 'Jacquenetta Slowgrave',
    email: 'jacq@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    isOnline: true
  },
  {
    id: 3,
    name: 'Nickola Peever',
    email: 'nick@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isOnline: true
  },
  {
    id: 4,
    name: 'Farand Hume',
    email: 'farand@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    isOnline: false
  },
  {
    id: 5,
    name: 'Ossie Peasey',
    email: 'ossie@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isOnline: true
  },
  {
    id: 6,
    name: 'Hall Negri',
    email: 'hall@example.com',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face',
    isOnline: false
  },
  {
    id: 7,
    name: 'Elyssa Segot',
    email: 'elyssa@example.com',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
    isOnline: true
  },
  {
    id: 8,
    name: 'Gil Wilfing',
    email: 'gil@example.com',
    avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&h=100&fit=crop&crop=face',
    isOnline: false
  },
  {
    id: 9,
    name: 'Bab Cleaton',
    email: 'bab@example.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    isOnline: true
  },
  {
    id: 10,
    name: 'Janith Satch',
    email: 'janith@example.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    isOnline: false
  }
];

let mockConversations: Conversation[] = [];
let mockMessages: Message[] = [];

// Initialize mock data
const initializeMockData = () => {
  // Create some mock conversations
  mockConversations = [
    {
      id: 'conv-1',
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      lastMessageAt: new Date(Date.now() - 3600000), // 1 hour ago
      users: [mockUsers[0], mockUsers[1]],
      messages: []
    },
    {
      id: 'conv-2',
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      lastMessageAt: new Date(Date.now() - 7200000), // 2 hours ago
      users: [mockUsers[0], mockUsers[2]],
      messages: []
    }
  ];

  // Create mock messages
  mockMessages = [
    {
      id: 'msg-1',
      body: 'I know how important this file is to you. You can trust me :) I know how important this file is to you. You can trust me :)',
      createdAt: new Date(Date.now() - 3600000),
      conversationId: 'conv-1',
      senderId: 2,
      sender: mockUsers[1],
      seen: [mockUsers[0]]
    },
    {
      id: 'msg-2',
      body: 'Great! Looking forward to it. Sounds perfect!',
      createdAt: new Date(Date.now() - 3000000),
      conversationId: 'conv-1',
      senderId: 1,
      sender: mockUsers[0],
      seen: [mockUsers[1]]
    },
    {
      id: 'msg-3',
      body: 'I know how important this file is to you. You can trust me :) I know how important this file is to you. You can trust me :) know how important this file is to you. You can trust me :)',
      createdAt: new Date(Date.now() - 2400000),
      conversationId: 'conv-1',
      senderId: 2,
      sender: mockUsers[1],
      seen: []
    },
    {
      id: 'msg-4',
      body: 'See you in 5 minutes!',
      createdAt: new Date(Date.now() - 1800000),
      conversationId: 'conv-1',
      senderId: 1,
      sender: mockUsers[0],
      seen: [mockUsers[1]]
    },
    {
      id: 'msg-5',
      body: 'Sounds perfect! I\'ve been wanting to discuss this project with you.',
      createdAt: new Date(Date.now() - 7200000),
      conversationId: 'conv-2',
      senderId: 3,
      sender: mockUsers[2],
      seen: [mockUsers[0]]
    }
  ];
};

initializeMockData();

export const apiClient = {
  // Users
  async getUsers(): Promise<User[]> {
    await delay(500);
    return mockUsers.filter(user => user.id !== 1); // Exclude current user
  },

  async getCurrentUser(): Promise<User> {
    await delay(300);
    return mockUsers[0];
  },

  // Conversations
  async getConversations(): Promise<Conversation[]> {
    await delay(800);
    return mockConversations.map(conv => ({
      ...conv,
      lastMessage: mockMessages
        .filter(msg => msg.conversationId === conv.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
    })).sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
  },

  async createOrGetConversation(userId1: number, userId2: number): Promise<Conversation> {
    await delay(600);
    
    // Check if conversation already exists
    const existing = mockConversations.find(conv =>
      conv.users.some(u => u.id === userId1) && conv.users.some(u => u.id === userId2)
    );

    if (existing) {
      return existing;
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      createdAt: new Date(),
      lastMessageAt: new Date(),
      users: [
        mockUsers.find(u => u.id === userId1)!,
        mockUsers.find(u => u.id === userId2)!
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
      sender: mockUsers.find(u => u.id === senderId)!,
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
        msg.seen.push(mockUsers.find(u => u.id === userId)!);
      }
    });
  }
};
