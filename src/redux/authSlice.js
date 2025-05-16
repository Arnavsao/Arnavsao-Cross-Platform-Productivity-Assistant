import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [], // store registered users: { id, name, email, password (plain for demo - VERY INSECURE) }
  currentUser: null, // { id, name, email }
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const { name, email, password } = action.payload; //Extracts user data from the dispatched action
      const existingUser = state.users.find(user => user.email === email); //Checks if a user with the same email already exists
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

      }
    },
    //matches the user's email and password to the users array
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