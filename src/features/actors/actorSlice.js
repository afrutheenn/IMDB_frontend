import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchActors = createAsyncThunk('actors/fetchAll', async () => {
  const response = await api.get('/actors/get');
  return response.data; 
});

export const addActor = createAsyncThunk('actors/add', async (actorData) => {
  const response = await api.post('/actors/post', actorData);
  return response.data.data;
});

const actorSlice = createSlice({
  name: 'actors',
  initialState: {
    data: [], 
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchActors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload || []; 
      })
      .addCase(fetchActors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addActor.fulfilled, (state, action) => {
        state.data = Array.isArray(state.data) 
          ? [...state.data, action.payload]
          : [action.payload];
      });
  }
});

export const selectAllActors = (state) => state.actors.data || [];
export const selectActorStatus = (state) => state.actors.status;  

export default actorSlice.reducer;