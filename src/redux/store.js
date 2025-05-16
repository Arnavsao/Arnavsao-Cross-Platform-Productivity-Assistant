import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authReducer from './authSlice';
import chatReducer from './chatSlice';
import videoReducer from './videoSlice';

const persistConfig = {
  key: 'root', // The key for the persist store in localStorage
  storage, // local storage
  whitelist: ['auth', 'chat', 'video'] 
};

//combines reducer from different slices 
const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  video: videoReducer,
});

//stores the reducer in local storage under the key 'root' 
//only the presisted part of the auth and chat reducers are stored
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,  // It tells configureStore() to use the persistedReducer instead of the plain rootReducer.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }),
});

export const persistor = persistStore(store); 