import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import ChatMessage from './ChatMessage';
import { Card, CardHeader, CardContent } from './ui/card'; // Assuming Card components are available
import { aiAPI } from '../services/api'; // Import aiAPI

interface Message {
  text: string;
  isUser: boolean;
}

interface ApiMessage {
  role: 'user' | 'model';
  text: string;
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi there! I'm your AI tutor. How can I help you today?", isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => { // Make handleSend async
    if (input.trim() === '' || isLoading) {
      return;
    }

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true); // Set loading to true

    try {
      // Format history for the API
      const apiHistory: ApiMessage[] = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'model',
        text: msg.text,
      }));

      // Define system instruction
      const systemInstruction = "You are an AI tutor for students. Provide helpful and concise answers. Keep responses appropriate for a learning environment.";

      const response = await aiAPI.chat(userMessage.text, apiHistory, systemInstruction);
      const aiResponseText = response.data.data.response;
      const aiMessage: Message = { text: aiResponseText, isUser: false };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      const errorMessage: Message = { text: "Oops! Something went wrong. Please try again.", isUser: false };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-7 w-7" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 h-[400px] flex flex-col shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">AI Assistant</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
            ))}
            {isLoading && ( // Show loading indicator
              <ChatMessage message="AI is typing..." isUser={false} />
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <div className="p-4 border-t flex items-center space-x-2">
            <Textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              className="flex-1 resize-none"
              disabled={isLoading} // Disable input when loading
            />
            <Button size="icon" onClick={handleSend} disabled={!input.trim() || isLoading}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AIChatbot;
