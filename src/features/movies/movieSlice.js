import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMovies = createAsyncThunk('movies/fetchAll', async () => {
  const response = await api.get('/movies/get');
  return response.data.data;
});

export const fetchMovieById = createAsyncThunk('movies/fetchById', async (id) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
});

export const addMovie = createAsyncThunk('movies/add', async (movieData) => {
  const response = await api.post('/movies/post', movieData);
  return response.data;
});

export const updateMovie = createAsyncThunk('movies/update', async ({ id, ...movieData }) => {
  const response = await api.put(`/movies/put/${id}`, movieData);
  return response.data;
});

export const deleteMovie = createAsyncThunk('/movies', async (id) => {
  await api.delete(`/movies/delete/${id}`);
  return id;
});

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        const existingIndex = state.items.findIndex(movie => movie._id === action.payload._id);
        if (existingIndex >= 0) {
          state.items[existingIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        const index = state.items.findIndex(movie => movie._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.items = state.items.filter(movie => movie._id !== action.payload);
      });
  }
});

export const selectAllMovies = (state) => state.movies.items;
export const selectMovieById = (state, movieId) => 
  state.movies.items.find(movie => movie._id === movieId);
export const selectMovieStatus = (state) => state.movies.status;
export const selectMovieError = (state) => state.movies.error;

export default movieSlice.reducer;
