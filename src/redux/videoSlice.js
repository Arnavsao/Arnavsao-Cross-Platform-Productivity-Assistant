import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// Helper function to build a more relevant search query
const buildSearchQuery = (currentQuery, context) => {
  let query = currentQuery;
  
  // Remove common words that don't help with search
  query = query.replace(/(?:show|find|recommend|suggest|me|some|a|the|videos?|youtube|tutorials?)/gi, '').trim();
  
  // Add context from focus mode if available
  if (context?.mode) {
    query = `${context.mode} ${query}`;
  }
  
  // Add relevant keywords based on the query
  if (query.toLowerCase().includes('learn')) {
    query = `tutorial ${query}`;
  } else if (query.toLowerCase().includes('how')) {
    query = `guide ${query}`;
  }
  
  return query;
};

// Async thunk for fetching video recommendations
export const fetchVideoRecommendations = createAsyncThunk(
  'video/fetchRecommendations',
  async ({ query, context, maxResults = 3 }, { rejectWithValue }) => {
    try {
      const searchQuery = buildSearchQuery(query, context);
      
      // First, get video IDs
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(searchQuery)}&type=video&key=${YOUTUBE_API_KEY}&relevanceLanguage=en&videoEmbeddable=true`
      );
      
      if (!searchResponse.ok) {
        throw new Error('Failed to fetch video recommendations');
      }

      const searchData = await searchResponse.json();
      
      if (!searchData.items?.length) {
        return [];
      }

      // Get video IDs for detailed information
      const videoIds = searchData.items.map(item => item.id.videoId).join(',');
      
      // Get detailed video information
      const videoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );

      if (!videoResponse.ok) {
        throw new Error('Failed to fetch video details');
      }

      const videoData = await videoResponse.json();
      
      // Combine search and video data
      return searchData.items.map((item, index) => {
        const videoDetails = videoData.items[index] || {};
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          viewCount: videoDetails.statistics?.viewCount || '0',
          duration: videoDetails.contentDetails?.duration || 'PT0S',
          // Add relevance score based on view count and recency
          relevanceScore: calculateRelevanceScore(
            videoDetails.statistics?.viewCount,
            item.snippet.publishedAt
          )
        };
      }).sort((a, b) => b.relevanceScore - a.relevanceScore); // Sort by relevance
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to calculate video relevance score
const calculateRelevanceScore = (viewCount, publishedAt) => {
  const views = parseInt(viewCount || '0');
  const publishDate = new Date(publishedAt);
  const now = new Date();
  const daysOld = (now - publishDate) / (1000 * 60 * 60 * 24);
  
  // Score based on views and recency
  const viewScore = Math.log10(views + 1);
  const recencyScore = Math.max(0, 1 - (daysOld / 365)); // Decay over a year
  
  return viewScore * (0.7 + 0.3 * recencyScore);
};

const initialState = {
  recommendations: [],
  isLoading: false,
  error: null,
  searchHistory: [] // Track previous searches
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    clearRecommendations: (state) => {
      state.recommendations = [];
      state.error = null;
    },
    addToSearchHistory: (state, action) => {
      state.searchHistory = [
        action.payload,
        ...state.searchHistory.slice(0, 4) // Keep last 5 searches
      ];
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

export const { clearRecommendations, addToSearchHistory } = videoSlice.actions;

// Selectors
export const selectVideoRecommendations = (state) => state.video.recommendations;
export const selectVideoIsLoading = (state) => state.video.isLoading;
export const selectVideoError = (state) => state.video.error;
export const selectSearchHistory = (state) => state.video.searchHistory;

export default videoSlice.reducer; 