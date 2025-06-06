
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useChatStore } from '@/store/useChatStore';
import { toast } from '@/hooks/use-toast';

// Query Keys
export const queryKeys = {
  users: ['users'] as const,
  currentUser: ['currentUser'] as const,
  conversations: ['conversations'] as const,
  messages: (conversationId: string) => ['messages', conversationId] as const,
};

// Session-based current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: apiClient.getCurrentUserFromSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: apiClient.getUsers,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Conversations (1-on-1 only)
export const useConversations = () => {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: apiClient.getConversations,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useCreateOrGetConversation = () => {
  const queryClient = useQueryClient();
  const { setActiveConversation, addConversation } = useChatStore();

  return useMutation({
    mutationFn: ({ userId1, userId2 }: { userId1: number; userId2: number }) =>
      apiClient.createOrGetConversation(userId1, userId2),
    onSuccess: (conversation) => {
      addConversation(conversation);
      setActiveConversation(conversation.id);
      
      // Invalidate and refetch conversations
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
    onError: (error) => {
      console.error('Failed to create/get conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

// Messages
export const useMessages = (conversationId: string | null) => {
  return useQuery({
    queryKey: queryKeys.messages(conversationId || ''),
    queryFn: () => apiClient.getMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { addOptimisticMessage, updateMessage, currentUser } = useChatStore();

  return useMutation({
    mutationFn: ({ 
      conversationId, 
      body, 
      image, 
      doc 
    }: { 
      conversationId: string; 
      body: string; 
      image?: string; 
      doc?: string; 
    }) => {
      if (!currentUser) throw new Error('No current user in session');
      return apiClient.sendMessage(conversationId, currentUser.id, body, image, doc);
    },
    onMutate: async ({ conversationId, body, image, doc }) => {
      if (!currentUser) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.messages(conversationId) });

      // Create optimistic message
      const optimisticId = `temp-${Date.now()}`;
      const optimisticMessage = {
        id: optimisticId,
        body,
        image,
        doc,
        createdAt: new Date(),
        conversationId,
        senderId: currentUser.id,
        sender: currentUser,
        seen: []
      };

      // Add optimistic message to store
      addOptimisticMessage(conversationId, optimisticMessage);

      return { optimisticId };
    },
    onSuccess: (newMessage, variables, context) => {
      // Replace optimistic message with real message
      if (context?.optimisticId) {
        updateMessage(variables.conversationId, context.optimisticId, newMessage);
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: queryKeys.messages(variables.conversationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
    onError: (error, variables, context) => {
      console.error('Failed to send message:', error);
      
      // Remove optimistic message on error
      if (context?.optimisticId) {
        console.log('Remove optimistic message:', context.optimisticId);
      }

      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useMarkMessagesAsSeen = () => {
  const queryClient = useQueryClient();
  const { markMessagesAsSeen, currentUser } = useChatStore();

  return useMutation({
    mutationFn: ({ messageIds }: { messageIds: string[] }) => {
      if (!currentUser) throw new Error('No current user in session');
      return apiClient.markMessagesAsSeen(messageIds, currentUser.id);
    },
    onMutate: async ({ messageIds }) => {
      if (!currentUser) return;

      // Optimistically mark messages as seen in the store
      const activeConversationId = useChatStore.getState().activeConversationId;
      if (activeConversationId) {
        markMessagesAsSeen(activeConversationId, messageIds, currentUser.id);
      }
    },
    onError: (error) => {
      console.error('Failed to mark messages as seen:', error);
    },
  });
};
