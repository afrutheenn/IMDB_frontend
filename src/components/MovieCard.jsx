import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  IconButton,
  Box
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie, onDelete }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token')
  const handleEditClick = () => {
    console.log("Navigating to edit movie with ID:", movie);
    navigate(`/movies/edit/${movie._id}`);
  };

  return (
    <Card sx={{ 
      width: 300, 
      height: 500,
      display: 'flex',
      flexDirection: 'column',
      margin: 'auto',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: 6
      }
    }}>
      <CardMedia
        component="img"
        height="200"
        image={movie.poster || 'https://via.placeholder.com/300x200?text=No+Poster'}
        alt={movie.name}
        sx={{ 
          objectFit: 'cover',
          width: '100%',
          height: 200 
        }}
      />
      <CardContent sx={{ 
        flexGrow: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {movie.name} ({movie.yearOfRelease})
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          paragraph
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {movie.plot || 'No plot available'}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" noWrap>
            <strong>Producer:</strong> {movie.producer?.name || 'Unknown'}
          </Typography>
          <Typography 
            variant="body2"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            <strong>Actors:</strong> {movie.actors?.map(a => a.name).join(', ') || 'Unknown'}
          </Typography>
        </Box>
      </CardContent>
      
      {/* Only show actions if authenticated */}
      {isAuthenticated && (
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <IconButton
            onClick={handleEditClick}
            color="primary"
            aria-label="edit"
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => onDelete(movie._id)}
            aria-label="delete"
          >
            <Delete />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
};

export default MovieCard;