import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchMovieById,
  fetchMovies,
  selectMovieById,
  updateMovie
} from '../features/movies/movieSlice';
import MovieForm from '../components/MovieForm';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';

const EditMoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const movie = useSelector((state) => selectMovieById(state, id));
  const status = useSelector(state => state.movies.status);

  React.useEffect(() => {
    dispatch(fetchMovieById(id));
  }, [id, dispatch]);

  const handleSubmit = async (movieData) => {
    try {
      await dispatch(updateMovie({ id, ...movieData })).unwrap();
      navigate('/');
      await dispatch(fetchMovies())
    } catch (err) {
      console.error('Failed to update movie:', err);
    }
  };

  if (status === 'loading') {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Movie not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
        Edit Movie
      </Typography>
      <MovieForm initialValues={movie} onSubmit={handleSubmit} isEdit={true} />
    </Container>
  );
};

export default EditMoviePage;