import React from 'react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`rounded-lg p-3 max-w-[70%] ${isUser
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground'
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;
