
import { useState } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!question.trim()) {
      setError('Please enter a question before sending.');
      return;
    }

    if (question.trim().length < 3) {
      setError('Question must be at least 3 characters long.');
      return;
    }

    setError('');
    onSendMessage(question.trim());
    setQuestion('');
  };

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-200 p-4 shadow-lg">
      {error && (
        <div className="mb-3 text-red-500 text-sm animate-fade-in bg-red-50 px-3 py-2 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <div className={`flex-1 relative transition-all duration-200 ${
          isFocused ? 'scale-[1.02]' : 'scale-100'
        }`}>
          <input
            type="text"
            value={question}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask about AI's impact on environmental sciences..."
            disabled={disabled}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
              error 
                ? 'border-red-300 focus:border-red-400 bg-red-50/50' 
                : 'border-emerald-200 focus:border-emerald-400 bg-white/50'
            } ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            } placeholder-gray-500`}
          />
          
          <div className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-200 ${
            isFocused ? 'opacity-100' : 'opacity-0'
          } bg-gradient-to-r from-emerald-400/20 to-teal-400/20`} />
        </div>

        <button
          type="submit"
          disabled={disabled || !question.trim()}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
            disabled || !question.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:scale-105 active:scale-95'
          }`}
        >
          <Send size={18} className={`transition-transform duration-200 ${
            disabled ? '' : 'hover:translate-x-1'
          }`} />
          <span>Send</span>
        </button>
      </form>

      <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
        <span>💡 Try asking about AI monitoring, predictive models, or sustainability</span>
        <span className={`transition-opacity duration-200 ${
          question.length > 0 ? 'opacity-100' : 'opacity-0'
        }`}>
          {question.length} characters
        </span>
      </div>
    </div>
  );
};

export default ChatInput;
