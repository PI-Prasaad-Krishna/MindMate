
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getChatMessages, sendChatMessage, subscribeToChatMessages } from '@/utils/storage';

interface ChatMessage {
  id: string;
  nickname: string;
  message: string;
  timestamp: Date;
}

interface ChatRoomProps {
  userNickname: string;
}

const ChatRoom = ({ userNickname }: ChatRoomProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load initial messages
    const loadMessages = async () => {
      const initialMessages = await getChatMessages();
      setMessages(initialMessages);
    };
    
    loadMessages();
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToChatMessages((newMessages) => {
      setMessages(newMessages);
    });
    
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    if (newMessage.length > 500) {
      toast({
        title: "Message too long",
        description: "Please keep messages under 500 characters.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    
    try {
      await sendChatMessage(userNickname, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again in a moment.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOwnMessage = (nickname: string) => nickname === userNickname;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-teal-700">
          <MessageCircle className="h-5 w-5" />
          Support Room
          <div className="ml-auto flex items-center gap-1 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            Anonymous Chat
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-50/50 rounded-lg min-h-0">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg mb-1">Welcome to the Support Room</p>
              <p className="text-sm">Share your thoughts or support others anonymously</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage(msg.nickname) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                    isOwnMessage(msg.nickname)
                      ? 'bg-teal-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${
                      isOwnMessage(msg.nickname) ? 'text-teal-100' : 'text-teal-600'
                    }`}>
                      {msg.nickname}
                    </span>
                    <span className={`text-xs ${
                      isOwnMessage(msg.nickname) ? 'text-teal-200' : 'text-gray-400'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm break-words">{msg.message}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Send a supportive message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            maxLength={500}
            className="flex-1 border-teal-200 focus:border-teal-400"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isSending || !newMessage.trim()}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-xs text-gray-400 text-center">
          Be kind and supportive. Messages are public and anonymous.
        </p>
      </CardContent>
    </Card>
  );
};

export default ChatRoom;
