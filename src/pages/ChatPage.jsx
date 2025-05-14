import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../redux/authSlice';
import {
  addMessage,
  loadMessagesForUser,
  fetchOpenAISuggestion,
  fetchOpenAIChatResponse,
  selectCurrentMessages,
  selectIsAISuggestionLoading,
  selectIsAIChatLoading,
  selectChatError,
  setUserFocusMode,
  setUserFocusMood,
  setUserFocusTimeOfDay,
  selectCurrentUserFocus
} from '../redux/chatSlice';

const ChatPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const messages = useSelector(selectCurrentMessages);
  const isSuggestionLoading = useSelector(selectIsAISuggestionLoading);
  const isChatReplyLoading = useSelector(selectIsAIChatLoading);
  const chatError = useSelector(selectChatError);
  const currentFocus = useSelector(selectCurrentUserFocus);
  
  const [newMessage, setNewMessage] = useState('');
  const [localTimeOfDay, setLocalTimeOfDay] = useState(currentFocus.timeOfDay || '');
  
  const messagesEndRef = useRef(null);

  const focusOptions = {
    modes: ['Gaming', 'Work', 'Study'],
    moods: ['Happy', 'Stressed', 'Tired', 'Energetic'],
  };

  useEffect(() => {
    if (currentUser) {
      dispatch(loadMessagesForUser({ userId: currentUser.id }));
    } 
  }, [currentUser, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    setLocalTimeOfDay(currentFocus.timeOfDay || '');
  }, [currentFocus.timeOfDay]);

  const handleFocusSubmit = () => {
    if (!currentUser || !currentFocus.mode || !currentFocus.mood || !localTimeOfDay.trim()) {
      alert('Please select Mode, Mood, and enter Time of Day.');
      return;
    }
    // Dispatch time of day directly, as it's part of the focus needed by the thunk
    dispatch(setUserFocusTimeOfDay(localTimeOfDay.trim())); 
    
    // Dispatch thunk to get OpenAI suggestion
    dispatch(fetchOpenAISuggestion({ 
      userId: currentUser.id, 
      mode: currentFocus.mode, 
      mood: currentFocus.mood, 
      timeOfDay: localTimeOfDay.trim() // Pass the latest timeOfDay
    }));
  };

  const handleUserMessageSend = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUser || isChatReplyLoading) return;

    const userMessagePayload = {
      userId: currentUser.id,
      message: { text: newMessage, sender: 'user', type: 'chat' }
    };
    dispatch(addMessage(userMessagePayload)); // Add user's message immediately
    
    // Then, fetch AI response
    dispatch(fetchOpenAIChatResponse({
      userId: currentUser.id,
      messagesHistory: [...messages, userMessagePayload.message], // Include the just-sent user message for context
      newMessageText: newMessage,
      currentUserFocus: currentFocus // Pass current focus for context
    }));

    setNewMessage('');
  };

  if (!currentUser) {
    return <div className="flex-grow flex items-center justify-center p-4"><p className="text-xl text-slate-400">Please log in to access the chat.</p></div>;
  }

  return (
    <div className="flex-grow flex flex-col items-center p-4 ">
      <div className="w-full max-w-5xl lg:max-w-6xl p-4 sm:p-6 bg-slate-800 bg-opacity-70 rounded-xl shadow-2xl backdrop-blur-lg border border-slate-700 flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-13rem)]">
        <h1 className="text-3xl font-bold text-sky-300 mb-4 text-center shrink-0">
          {/* Zenith Mode Assistant */}
        </h1>
        
        <div className="flex flex-col md:flex-row flex-grow gap-4 overflow-hidden">
          <div className="md:w-1/3 lg:w-80 xl:w-96 p-4 bg-slate-700/80 rounded-lg shadow-lg flex flex-col gap-3 shrink-0 md:overflow-y-auto">
            <h2 className="text-xl text-sky-400 font-semibold text-center mb-2">Set Your Focus</h2>
            <div>
              <label htmlFor="focusMode" className="block text-sm font-medium text-slate-300 mb-1">Mode</label>
              <select 
                id="focusMode" 
                value={currentFocus.mode || ''}
                onChange={(e) => dispatch(setUserFocusMode(e.target.value))}
                className="w-full p-2.5 rounded-md bg-slate-600 text-white border border-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="" disabled>Select Mode...</option>
                {focusOptions.modes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="focusMood" className="block text-sm font-medium text-slate-300 mb-1">Mood</label>
              <select 
                id="focusMood" 
                value={currentFocus.mood || ''}
                onChange={(e) => dispatch(setUserFocusMood(e.target.value))}
                className="w-full p-2.5 rounded-md bg-slate-600 text-white border border-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="" disabled>Select Mood...</option>
                {focusOptions.moods.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="focusTime" className="block text-sm font-medium text-slate-300 mb-1">Time of Day</label>
              <input 
                type="text" 
                id="focusTime" 
                value={localTimeOfDay}
                onChange={(e) => setLocalTimeOfDay(e.target.value)} 
                placeholder="e.g., Morning, 2 PM" 
                className="w-full p-2.5 rounded-md bg-slate-600 text-white border border-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400"
              />
            </div>
            <button 
              onClick={handleFocusSubmit}
              disabled={isSuggestionLoading || !currentFocus.mode || !currentFocus.mood || !localTimeOfDay.trim()}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSuggestionLoading ? 'Getting Plan...' : 'Get Focus Plan'}
            </button>
          </div>

          <div className="flex-grow flex flex-col bg-slate-700/50 rounded-lg shadow-inner overflow-hidden">
            {chatError && <p className='text-red-400 text-sm text-center p-2 bg-red-900/30 rounded-t-lg shrink-0'>Error: {typeof chatError === 'string' ? chatError : JSON.stringify(chatError)}</p>}

            <div className="flex-grow p-3 sm:p-4 space-y-3 overflow-y-auto">
              {messages.length === 0 && !isSuggestionLoading && !isChatReplyLoading && (
                <p className="text-slate-400 text-center pt-10">Set your focus or start the conversation!</p>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[70%] md:max-w-[75%] px-3.5 py-2 rounded-xl shadow whitespace-pre-wrap break-words ${ 
                      msg.sender === 'user' 
                      ? 'bg-sky-600 text-white' 
                      : msg.sender === 'ai_suggestion'
                      ? 'bg-teal-700 text-white' 
                      : 'bg-slate-600 text-slate-100'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-sky-200' : 'text-slate-400'} text-right`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {msg.sender === 'ai_suggestion' && <span className='ml-1 font-semibold text-teal-300'>(Focus Plan)</span>}
                      {msg.sender === 'ai' && <span className='ml-1 font-semibold text-purple-300'>(Zenith)</span>}
                    </p>
                  </div>
                </div>
              ))}
              {isChatReplyLoading && <p className='text-slate-400 text-sm text-center animate-pulse'>Zenith is thinking...</p>}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleUserMessageSend} className="flex space-x-2 sm:space-x-3 p-3 sm:p-4 border-t border-slate-600/50 shrink-0 bg-slate-700/60 rounded-b-lg">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Chat about your focus or ask anything..." 
                className="flex-grow p-3 rounded-lg border-slate-600 bg-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm placeholder-slate-400"
              />
              <button 
                type="submit" 
                disabled={isSuggestionLoading || isChatReplyLoading || newMessage.trim() === ''}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 sm:px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChatReplyLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 