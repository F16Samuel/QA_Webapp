import { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import LoadingIndicator from '../components/LoadingIndicator';

const { VITE_APP_API_BASE_URL } = import.meta.env;

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // API Service functions
  const apiService = {
    // POST /api/chat - Send a new question
    sendQuestion: async (question) => {
      try {
        const response = await fetch(`${VITE_APP_API_BASE_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error sending question:', error);
        throw error;
      }
    },

    // GET /api/chat - Fetch all chat records
    getAllChats: async () => {
      try {
        const response = await fetch(`${VITE_APP_API_BASE_URL}/api/chat`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching all chats:', error);
        throw error;
      }
    },

    // GET /api/chat/{id} - Fetch single chat record by id
    getChatById: async (id) => {
      try {
        const response = await fetch(`${VITE_APP_API_BASE_URL}/api/chat/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`Error fetching chat with id ${id}:`, error);
        throw error;
      }
    }
  };

  // Load chat history from backend
  const loadChatHistory = async () => {
    setIsLoadingHistory(true);
    setError(null);

    try {
      const chatHistory = await apiService.getAllChats();
      
      // Transform backend chat records to frontend message format
      const transformedMessages = [];
      
      // Add welcome message if no history exists
      if (chatHistory.length === 0) {
        transformedMessages.push({
          id: 'welcome',
          text: "Hello! I'm here to help you understand the impact of AI on Environmental Sciences. What would you like to know?",
          isBot: true,
          timestamp: new Date()
        });
      } else {
        // Convert each chat record to user question + bot response pair
        chatHistory.forEach((chat) => {
          // User question message
          transformedMessages.push({
            id: `${chat.id}_question`,
            text: chat.question,
            isBot: false,
            timestamp: new Date(chat.asked_at)
          });

          // Bot response message
          transformedMessages.push({
            id: chat.id,
            text: chat.answer,
            isBot: true,
            timestamp: new Date(chat.asked_at)
          });
        });
      }

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setError('Failed to load chat history. Starting with a fresh conversation.');
      
      // Set default welcome message on error
      setMessages([{
        id: 'welcome',
        text: "Hello! I'm here to help you understand the impact of AI on Environmental Sciences. What would you like to know?",
        isBot: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Refresh chat history
  const refreshChatHistory = async () => {
    await loadChatHistory();
  };

  // Updated handleSendMessage function
  const handleSendMessage = async (question) => {
    // Frontend validation - ensure question is not empty
    if (!question || question.trim() === '') {
      setError('Question cannot be empty');
      return;
    }

    // Clear any existing errors
    setError(null);

    // Add user message immediately for better UX
    const userMessage = {
      id: `temp_${Date.now()}`,
      text: question.trim(),
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Make actual API call to backend
      const response = await apiService.sendQuestion(question.trim());
      
      // Update user message with actual backend ID
      const updatedUserMessage = {
        ...userMessage,
        id: `${response.id}_question`,
        timestamp: new Date(response.asked_at)
      };

      // Add bot response
      const botResponse = {
        id: response.id,
        text: response.answer,
        isBot: true,
        timestamp: new Date(response.asked_at)
      };
      
      // Update messages - replace temp user message and add bot response
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = updatedUserMessage; // Replace temp message
        updated.push(botResponse); // Add bot response
        return updated;
      });

    } catch (error) {
      // Handle API errors gracefully
      const errorResponse = {
        id: `error_${Date.now()}`,
        text: 'Sorry, I encountered an error while processing your question. Please try again.',
        isBot: true,
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorResponse]);
      setError(error.message || 'Failed to get AI response');
      console.error('Failed to get AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while fetching chat history
  if (isLoadingHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <span className="text-white font-bold text-2xl">🌍</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Chat History</h2>
          <p className="text-gray-500">Please wait while we fetch your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌍</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  AI Assistant
                </h1>
                <p className="text-gray-600 text-sm">Exploring AI's impact on environmental research</p>
              </div>
            </div>
            
            {/* Refresh button */}
            <button
              onClick={refreshChatHistory}
              disabled={isLoadingHistory}
              className="px-3 py-2 text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh chat history"
            >
              🔄 Refresh
            </button>
          </div>
          
          {/* Error display */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-6 py-6 h-[calc(100vh-120px)] flex flex-col">
        {/* Messages Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-6 space-y-4 scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-transparent"
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && <LoadingIndicator />}
        </div>

        {/* Chat Stats */}
        <div className="mb-4 text-center">
          <p className="text-xs text-gray-500">
            {messages.filter(m => !m.isBot).length} questions asked • {messages.filter(m => m.isBot && m.id !== 'welcome').length} responses received
          </p>
        </div>

        {/* Input Area */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Index;