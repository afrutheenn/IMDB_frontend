import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducers = createAsyncThunk('producers/fetchAll', async () => {
  const response = await api.get('/producers/get');
  console.log('Producers fetchedssssssssssssss:', response.data);
  return response.data;
});

export const addProducer = createAsyncThunk('producers/add', async (producerData) => {
  const response = await api.post('/producers/post', producerData);
  return response.data;
});

const producerSlice = createSlice({
  name: 'producers',
  initialState: {
    items: [],  
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;  
      })
      .addCase(fetchProducers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const selectAllProducers = (state) => state.producers?.items || [];
export const selectProducerStatus = (state) => state.producers.status;

export default producerSlice.reducer;
