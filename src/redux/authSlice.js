import { createSlice } from '@reduxjs/toolkit';

// IMPORTANT SECURITY WARNING:
// Storing passwords, even "hashed" in this simplified way, directly in client-side Redux 
// is NOT secure for real applications. This is for demonstration purposes only 
// as per the request to use Redux as a temporary client-side data store.
// In a real application, authentication must be handled by a secure backend.

const initialState = {
  users: [], // Array to store registered users: { id, name, email, password (plain for demo - VERY INSECURE) }
  currentUser: null, // { id, name, email }
  isAuthenticated: false,
  error: null,
  // No token needed if we purely rely on Redux state for auth status in this client-only demo
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const { name, email, password } = action.payload;
      const existingUser = state.users.find(user => user.email === email);
      if (existingUser) {
        state.error = 'User with this email already exists.';
      } else {
        const newUser = {
          id: Date.now().toString(), // Simple unique ID
          name,
          email,
          password, // Storing plain password - EXTREMELY INSECURE for real apps
        };
        state.users.push(newUser);
        state.error = null; // Clear error on successful registration
        // Optionally, log in the user directly after registration by setting currentUser and isAuthenticated
        // state.currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
        // state.isAuthenticated = true;
      }
    },
    loginUser: (state, action) => {
      const { email, password } = action.payload;
      const user = state.users.find(u => u.email === email && u.password === password);
      if (user) {
        state.currentUser = { id: user.id, name: user.name, email: user.email };
        state.isAuthenticated = true;
        state.error = null;
      } else {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = 'Invalid email or password.';
      }
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
});

export const { registerUser, loginUser, logoutUser, clearAuthError } = authSlice.actions;

// Selectors
export const selectCurrentUser = state => state.auth.currentUser;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectAuthError = state => state.auth.error;
export const selectAllUsers = state => state.auth.users; // For debugging or admin (not typically exposed)

export default authSlice.reducer; 