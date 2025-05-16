import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
//Initializes the OpenAI client if the API key is found
let openai;
if (apiKey) {
  openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });
} else {
  console.error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env.local file.');
}

//Creates an async thunk to call OpenAI 
export const fetchOpenAISuggestion = createAsyncThunk(
  'chat/fetchOpenAISuggestion',
  //rejectWithValue lets you pass a custom error message to the reducer.
  async ({ userId, mode, mood, timeOfDay }, { rejectWithValue }) => {
    if (!openai) return rejectWithValue('OpenAI client not initialized.');
    
    //	Builds a custom prompt for GPT with the user’s mode, mood, and timeOfDay.
    const prompt = `You are Zenith Mode, a helpful productivity assistant. The user is about to start a session.
    Mode: ${mode}
    Mood: ${mood}
    Time of Day: ${timeOfDay}
    Based on this, provide 2-3 concise and actionable suggestions. Each suggestion should include:
    1. What the user should do (e.g., "Take a 5-min break and stretch").
    2. Which app to open or site to visit, if applicable (e.g., "Open Spotify and play a focus playlist").
    3. Optionally, a very short, relevant piece of advice or a quote (1 sentence max).
    Format the response as a single block of text, with each suggestion clearly separated. Example:
    "Okay, for your ${mode} session feeling ${mood} this ${timeOfDay}, here are some ideas:\n- Action: Start with a 10-minute warm-up task. App/Site: Your project management tool (e.g., Trello, Asana). Advice: "A little progress each day adds up to big results."\n- Action: Put on some Lo-Fi beats. App/Site: YouTube or Spotify. Advice: "Music can be a great way to get in the zone."\n- Action: Review your top 3 goals for this session. App/Site: Your notes app. Advice: "Clarity precedes success."
"`;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Or your preferred model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 200,
      });
      const suggestionText = completion.choices[0]?.message?.content?.trim();
      if (!suggestionText) throw new Error('No suggestion text received from OpenAI.');
      return { userId, suggestionText };
    } catch (error) {
      console.error('OpenAI API error (fetchOpenAISuggestion):', error);
      return rejectWithValue(error.message || 'Failed to fetch suggestion from OpenAI');
    }
  }
);

//Creates an async thunk to call OpenAI 
//Fetches AI response to the user’s message in the chat.
export const fetchOpenAIChatResponse = createAsyncThunk(
  'chat/fetchOpenAIChatResponse',
  async ({ userId, messagesHistory, newMessageText, currentUserFocus }, { rejectWithValue }) => {
    if (!openai) return rejectWithValue('OpenAI client not initialized.');

    // Construct a simplified history for the prompt
    const simplifiedHistory = messagesHistory
    //Uses the last 6 messages to keep the context concise.
      .slice(-6) // Take last 6 messages to keep prompt length reasonable
      .map(msg => `${msg.sender === 'user' ? 'User' : (msg.sender === 'ai_suggestion' ? 'Zenith (Suggestion)' : 'Zenith')}: ${msg.text}`)
      .join('\n');

    //Adds the current focus context to the prompt
    const focusContext = currentUserFocus.mode ? `Current Focus: Mode - ${currentUserFocus.mode}, Mood - ${currentUserFocus.mood}, Time - ${currentUserFocus.timeOfDay}.\n` : '';

    //Builds the final prompt for GPT
    const prompt = `${focusContext}Chat History:\n${simplifiedHistory}\nUser: ${newMessageText}\nZenith:`;
    

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 150,
        stop: ["User:"], // Stop generation if it tries to simulate user input
      });
      const chatResponseText = completion.choices[0]?.message?.content?.trim();
      if (!chatResponseText) throw new Error('No response text received from OpenAI.');
      return { userId, message: { text: chatResponseText, sender: 'ai', type: 'chat' } };
    } catch (error) {
      console.error('OpenAI API error (fetchOpenAIChatResponse):', error);
      return rejectWithValue(error.message || 'Failed to fetch chat response from OpenAI');
    }
  }
);

//Initializes the chat slice with the following state properties:
const initialState = {

  chatsByUser: {},
  currentMessages: [], // Messages for the currently active user in ChatPage
  isLoading: false,
  isAISuggestionLoading: false, // Separate loading for initial suggestion
  isAIChatLoading: false,      // Separate loading for chat responses
  error: null,
  // New state for focus selection
  currentUserFocus: {
    mode: null, // 'Gaming', 'Work', 'Study'
    mood: null, // 'Happy', 'Stressed', 'Tired', 'Energetic'
    timeOfDay: '', // Can be manually entered string or auto-detected
  },
};


//Creates the chat slice with the following reducers:
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    //Loads messages for a specific user
    loadMessagesForUser: (state, action) => {
      const { userId } = action.payload;
      state.currentMessages = state.chatsByUser[userId] || [];
      state.currentUserFocus = initialState.currentUserFocus; // Reset focus when loading/switching user
      state.isLoading = false; 
      state.error = null; // Clear error when loading messages
    },
    //Adds a new message to the chat history
    addMessage: (state, action) => {
      const { userId, message } = action.payload; // message: { text, sender, type (e.g. 'chat' or 'suggestion') }
      if (!state.chatsByUser[userId]) {
        state.chatsByUser[userId] = [];
      }
      const newMessage = {
        id: Date.now().toString(),
        ...message, 
        timestamp: new Date().toISOString(),
      };
      state.chatsByUser[userId].push(newMessage);
      state.currentMessages.push(newMessage);
    },
    // Actions for setting focus
    setUserFocusMode: (state, action) => {
      state.currentUserFocus.mode = action.payload;
    },
    setUserFocusMood: (state, action) => {
      state.currentUserFocus.mood = action.payload;
    },
    setUserFocusTimeOfDay: (state, action) => {
      state.currentUserFocus.timeOfDay = action.payload;
    },
    // Action to add the initial suggestion as a message
    addInitialSuggestionInternal: (state, action) => { // Renamed to avoid conflict with thunk
      const { userId, suggestionText } = action.payload;
      if (!state.chatsByUser[userId]) {
        state.chatsByUser[userId] = [];
      }
      const suggestionMessage = {
        id: 'suggestion-' + Date.now().toString(),
        text: suggestionText,
        sender: 'ai_suggestion', // Special sender for styling/identification
        timestamp: new Date().toISOString(),
        type: 'suggestion' // Explicit type
      };
      state.chatsByUser[userId].push(suggestionMessage);
      state.currentMessages.push(suggestionMessage); 
      // Clear focus after suggestion is made, or keep it for context?
      // state.currentUserFocus = initialState.currentUserFocus;
    },
    chatOperationFailed: (state, action) => {
      // Generic error, thunks might set more specific loading states to false
      state.isLoading = false; 
      state.isAISuggestionLoading = false;
      state.isAIChatLoading = false;
      state.error = action.payload;
    },
    clearChatForUser: (state, action) => {
      const { userId } = action.payload;
      if (state.chatsByUser[userId]) {
        state.chatsByUser[userId] = [];
      }
      if (state.currentMessages.length > 0 && state.chatsByUser[userId]?.find(msg => msg.id === state.currentMessages[0]?.id) === undefined) {
         state.currentMessages = [];
      }
      state.currentUserFocus = initialState.currentUserFocus; // Reset focus when clearing chat
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchOpenAISuggestion
      .addCase(fetchOpenAISuggestion.pending, (state) => {
        state.isAISuggestionLoading = true;
        state.error = null;
      })
      .addCase(fetchOpenAISuggestion.fulfilled, (state, action) => {
        state.isAISuggestionLoading = false;
        const { userId, suggestionText } = action.payload;
        // Use the internal action to add the suggestion
        chatSlice.caseReducers.addInitialSuggestionInternal(state, { payload: { userId, suggestionText }, type: 'chat/addInitialSuggestionInternal' });
      })
      .addCase(fetchOpenAISuggestion.rejected, (state, action) => {
        state.isAISuggestionLoading = false;
        state.error = action.payload;
      })
      // Handle fetchOpenAIChatResponse
      .addCase(fetchOpenAIChatResponse.pending, (state) => {
        state.isAIChatLoading = true;
        state.error = null;
      })
      .addCase(fetchOpenAIChatResponse.fulfilled, (state, action) => {
        state.isAIChatLoading = false;
        const { userId, message } = action.payload;
        // Use the existing addMessage reducer
        chatSlice.caseReducers.addMessage(state, { payload: { userId, message }, type: 'chat/addMessage' });
      })
      .addCase(fetchOpenAIChatResponse.rejected, (state, action) => {
        state.isAIChatLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  loadMessagesForUser,
  addMessage,
  setUserFocusMode,
  setUserFocusMood,
  setUserFocusTimeOfDay,
  chatOperationFailed,
  clearChatForUser
} = chatSlice.actions;

// Selectors
export const selectCurrentMessages = state => state.chat.currentMessages;
export const selectChatIsLoading = state => state.chat.isLoading;
export const selectIsAISuggestionLoading = state => state.chat.isAISuggestionLoading;
export const selectIsAIChatLoading = state => state.chat.isAIChatLoading;
export const selectChatError = state => state.chat.error;
export const selectUserChats = (userId) => (state) => state.chat.chatsByUser[userId] || [];
export const selectCurrentUserFocus = state => state.chat.currentUserFocus;

export default chatSlice.reducer; 