import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addMovie, fetchMovies } from '../features/movies/movieSlice';
import MovieForm from '../components/MovieForm';
import { Container, Typography } from '@mui/material';

const AddMoviePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (movieData) => {
    try {
      await dispatch(addMovie(movieData)).unwrap();
      navigate('/');
      await dispatch(fetchMovies())
    } catch (err) {
      console.error('Failed to save movie:', err);
    }
  };

  return (
<Container maxWidth={false} disableGutters>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
      </Typography>
      <MovieForm onSubmit={handleSubmit} />
    </Container>
  );
};

export default AddMoviePage;