import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// Async thunk for fetching video recommendations
export const fetchVideoRecommendations = createAsyncThunk(
  'video/fetchRecommendations',
  async ({ query, maxResults = 3 }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch video recommendations');
      }

      const data = await response.json();
      return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  recommendations: [],
  isLoading: false,
  error: null
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    clearRecommendations: (state) => {
      state.recommendations = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoRecommendations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVideoRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchVideoRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearRecommendations } = videoSlice.actions;

// Selectors
export const selectVideoRecommendations = (state) => state.video.recommendations;
export const selectVideoIsLoading = (state) => state.video.isLoading;
export const selectVideoError = (state) => state.video.error;

export default videoSlice.reducer; 