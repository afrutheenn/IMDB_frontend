import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from "./app/store.js";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MovieListPage from './pages/MovieListPage';
import AddMoviePage from './pages/AddMoviePage';
import EditMoviePage from './pages/EditMoviePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { Box } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#f5c518',  
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#f5f5f5', 
      paper: '#ffffff',},
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
        '#root': {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          flex: 1,
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}>
            <Navbar />
            <Box component="main" sx={{ 
              flex: 1,
              py: 3,
            }}>
              <Routes>
                <Route path="/" element={<MovieListPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/movies/add" element={<AddMoviePage />} />
                  <Route path="/movies/edit/:id" element={<EditMoviePage />} />
                </Route>
              </Routes>
            </Box>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;