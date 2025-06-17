import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

const ChatMessage = ({ message }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFullTimestamp, setShowFullTimestamp] = useState(false);

  // Enhanced timestamp formatting for ISO dates from backend
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp received:', timestamp);
      return new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format full timestamp with date for detailed view
  const formatFullTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } else {
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  // Handle timestamp click to toggle detailed view
  const handleTimestampClick = () => {
    setShowFullTimestamp(!showFullTimestamp);
  };

  // Determine if message has error styling
  const isErrorMessage = message.isError || false;

  return (
    <div
      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex max-w-xs lg:max-w-2xl ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 ${message.isBot ? 'mr-3' : 'ml-3'}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-transform duration-200 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${
              message.isBot
                ? isErrorMessage
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
            }`}
          >
            {message.isBot ? (isErrorMessage ? '⚠️' : '🤖') : '👤'}
          </div>
        </div>

        {/* Message Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl transition-all duration-200 hover:shadow-lg ${
            isHovered ? 'transform translate-y-[-2px]' : ''
          } ${
            message.isBot
              ? isErrorMessage
                ? 'bg-red-50/70 backdrop-blur-sm border border-red-200 text-red-800'
                : 'bg-white/70 backdrop-blur-sm border border-emerald-200 text-gray-800'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
          }`}
        >
          <div className="text-sm leading-relaxed whitespace-pre-wrap prose prose-sm prose-p:my-2 prose-li:my-1 max-w-full">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>

          {/* Timestamp */}
          <div
            className={`text-xs mt-2 transition-opacity duration-200 cursor-pointer hover:opacity-100 ${
              isHovered ? 'opacity-70' : 'opacity-0'
            } ${
              message.isBot 
                ? isErrorMessage 
                  ? 'text-red-500' 
                  : 'text-gray-500'
                : 'text-white/70'
            }`}
            onClick={handleTimestampClick}
            title={showFullTimestamp ? 'Click to show time only' : 'Click to show full timestamp'}
          >
            {showFullTimestamp ? formatFullTimestamp(message.timestamp) : formatTime(message.timestamp)}
          </div>

          {/* Message ID for debugging (only show in development) */}
          {process.env.NODE_ENV === 'development' && isHovered && (
            <div className={`text-xs mt-1 opacity-50 ${message.isBot ? 'text-gray-400' : 'text-white/50'}`}>
              ID: {message.id}
            </div>
          )}

          {/* Message Tail */}
          <div
            className={`absolute top-3 w-3 h-3 transform rotate-45 ${
              message.isBot
                ? isErrorMessage
                  ? 'left-[-6px] bg-red-50/70 border-l border-b border-red-200'
                  : 'left-[-6px] bg-white/70 border-l border-b border-emerald-200'
                : 'right-[-6px] bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;