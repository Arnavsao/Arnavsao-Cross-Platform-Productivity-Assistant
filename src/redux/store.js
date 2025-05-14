import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authReducer from './authSlice';
import chatReducer from './chatSlice';

const persistConfig = {
  key: 'root', // The key for the persist store in localStorage
  storage,
  whitelist: ['auth', 'chat'] // Persist auth and chat slices. Add other slices if needed.
  // blacklist: [] // Slices to not persist
};

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  // Add other reducers here if you have more slices
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist, as they are not typically serializable
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }),
});

export const persistor = persistStore(store); 