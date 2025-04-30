import { configureStore } from '@reduxjs/toolkit';
import movieReducer from '../features/movies/movieSlice';
import actorReducer from '../features/actors/actorSlice';
import producerReducer from '../features/producers/producerSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    actors: actorReducer,
    producers: producerReducer,
    auth: authReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});