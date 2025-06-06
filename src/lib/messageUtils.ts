
import { type Message } from '@/store/useChatStore';

export interface MessageGroup {
  senderId: number;
  messages: Message[];
  timestamp: Date;
}

export const groupMessagesBySender = (messages: Message[]): MessageGroup[] => {
  if (!messages.length) return [];

  const groups: MessageGroup[] = [];
  let currentGroup: MessageGroup | null = null;

  const TIME_THRESHOLD = 5 * 60 * 1000; // 5 minutes

  messages.forEach((message) => {
    const shouldStartNewGroup = 
      !currentGroup ||
      currentGroup.senderId !== message.senderId ||
      (message.createdAt.getTime() - currentGroup.timestamp.getTime()) > TIME_THRESHOLD;

    if (shouldStartNewGroup) {
      if (currentGroup) {
        groups.push(currentGroup);
      }
      currentGroup = {
        senderId: message.senderId,
        messages: [message],
        timestamp: message.createdAt
      };
    } else {
      currentGroup.messages.push(message);
      currentGroup.timestamp = message.createdAt;
    }
  });

  if (currentGroup) {
    groups.push(currentGroup);
  }

  return groups;
};

export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now';
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // More than 24 hours
  return date.toLocaleDateString();
};

export const getLastSeenText = (message: Message, currentUserId: number): string => {
  const seenByOthers = message.seen.filter(user => user.id !== currentUserId);
  
  if (seenByOthers.length === 0) {
    return 'Sent';
  }
  
  if (seenByOthers.length === 1) {
    return `Seen by ${seenByOthers[0].name}`;
  }
  
  return `Seen by ${seenByOthers.length} people`;
};
