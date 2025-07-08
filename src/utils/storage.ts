// Local storage utilities for MVP (will be replaced with Firebase in production)

export interface MoodEntry {
  date: string;
  score: number;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  nickname: string;
  message: string;
  timestamp: Date;
}

// Generate random nickname
export const generateNickname = (): string => {
  const adjectives = [
    'Calm', 'Brave', 'Kind', 'Gentle', 'Strong', 'Wise', 'Peaceful', 'Bright',
    'Serene', 'Caring', 'Hopeful', 'Resilient', 'Warm', 'Mindful', 'Clear'
  ];
  
  const animals = [
    'Tiger', 'Eagle', 'Dolphin', 'Owl', 'Fox', 'Bear', 'Wolf', 'Deer',
    'Swan', 'Lion', 'Butterfly', 'Whale', 'Hawk', 'Turtle', 'Phoenix'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 99) + 1;
  
  return `${adjective}${animal}${number}`;
};

// Mood tracking functions
export const saveMoodEntry = async (score: number): Promise<void> => {
  const today = new Date().toISOString().split('T')[0];
  const entry: MoodEntry = {
    date: today,
    score,
    timestamp: Date.now()
  };
  
  const existingEntries = JSON.parse(localStorage.getItem('mindmate_moods') || '[]');
  const filteredEntries = existingEntries.filter((e: MoodEntry) => e.date !== today);
  filteredEntries.push(entry);
  
  localStorage.setItem('mindmate_moods', JSON.stringify(filteredEntries));
};

export const getMoodHistory = async (): Promise<Array<{date: string, score: number}>> => {
  const entries: MoodEntry[] = JSON.parse(localStorage.getItem('mindmate_moods') || '[]');
  
  // Get last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return entries
    .filter(entry => new Date(entry.date) >= sevenDaysAgo)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({ date: entry.date, score: entry.score }));
};

// Chat functions (simplified for MVP - in production would use Firebase)
let chatListeners: ((messages: ChatMessage[]) => void)[] = [];

export const getChatMessages = async (): Promise<ChatMessage[]> => {
  const messages = JSON.parse(localStorage.getItem('mindmate_chat') || '[]');
  return messages.map((msg: any) => ({
    ...msg,
    timestamp: new Date(msg.timestamp)
  })).slice(-50); // Keep only last 50 messages
};

export const sendChatMessage = async (nickname: string, message: string): Promise<void> => {
  const newMessage: ChatMessage = {
    id: Date.now().toString(),
    nickname,
    message,
    timestamp: new Date()
  };
  
  const existingMessages = JSON.parse(localStorage.getItem('mindmate_chat') || '[]');
  existingMessages.push({
    ...newMessage,
    timestamp: newMessage.timestamp.toISOString()
  });
  
  // Keep only last 50 messages
  const trimmedMessages = existingMessages.slice(-50);
  localStorage.setItem('mindmate_chat', JSON.stringify(trimmedMessages));
  
  // Notify listeners
  const messages = trimmedMessages.map((msg: any) => ({
    ...msg,
    timestamp: new Date(msg.timestamp)
  }));
  
  chatListeners.forEach(listener => listener(messages));
};

export const subscribeToChatMessages = (callback: (messages: ChatMessage[]) => void) => {
  chatListeners.push(callback);
  
  return () => {
    chatListeners = chatListeners.filter(listener => listener !== callback);
  };
};
