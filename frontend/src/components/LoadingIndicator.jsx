
const LoadingIndicator = () => {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex max-w-xs lg:max-w-2xl">
        {/* Avatar */}
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-sm font-semibold animate-pulse">
            🤖
          </div>
        </div>

        {/* Loading Bubble */}
        <div className="bg-white/70 backdrop-blur-sm border border-emerald-200 px-4 py-3 rounded-2xl relative shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-gray-500 text-sm">AI is thinking...</span>
          </div>

          {/* Message tail */}
          <div className="absolute left-[-6px] top-3 w-3 h-3 transform rotate-45 bg-white/70 border-l border-b border-emerald-200" />
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
