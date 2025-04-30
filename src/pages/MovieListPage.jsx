import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteMovie,
  fetchMovies,
  selectAllMovies,
  selectMovieStatus,
} from '../features/movies/movieSlice';
import { 
  Container, 
  Grid, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert, 
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

const MovieListPage = () => {
  const dispatch = useDispatch();
  const movies = useSelector(selectAllMovies);
  const status = useSelector(selectMovieStatus);
  const theme = useTheme();
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMovies());
    }
  }, [status, dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await dispatch(deleteMovie(id)).unwrap();
        dispatch(fetchMovies()); 
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  if (status === 'loading') {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flex: 1,
        minHeight: 'calc(100vh - 64px)'
      }}>
        <CircularProgress size={80} />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flex: 1,
        minHeight: 'calc(100vh - 64px)',
        p: 3
      }}>
        <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
          Failed to load movies. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Container maxWidth="xl" sx={{ 
        py: 4,
        flex: 1,
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary
              }}
            >
              Featured Movies
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: theme.palette.text.secondary,
              }}
            >
              Browse our collection of movies
            </Typography>
          </Box>
          {isAuthenticated && (
            <Button
              component={Link}
              to="/movies/add"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{
                height: 'fit-content'
              }}
            >
              Add Movie
            </Button>
          )}
        </Box>

        {movies.length === 0 ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            minHeight: '50vh',
            textAlign: 'center'
          }}>
            <Typography variant="h5" color="textSecondary" gutterBottom>
              No movies found
            </Typography>
            {isAuthenticated && (
              <Button
                component={Link}
                to="/movies/add"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
              >
                Add Your First Movie
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {movies.map((movie) => (
              <Grid item key={movie._id}>
                <MovieCard 
                  movie={movie} 
                  onDelete={isAuthenticated ? handleDelete : null}
                  showActions={isAuthenticated}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Box sx={{ 
        py: 4,
        backgroundColor: theme.palette.background.paper,
      }}>
        <Container maxWidth="xl">
          <Typography 
            variant="body2" 
            color="textSecondary" 
            align="center"
          >
            © {new Date().getFullYear()} Movie Library - All rights reserved
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MovieListPage;