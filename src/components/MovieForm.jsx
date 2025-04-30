import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useSelector, useDispatch } from 'react-redux';
import { fetchActors, addActor, selectAllActors } from '../features/actors/actorSlice';
import { fetchProducers, addProducer, selectAllProducers } from '../features/producers/producerSlice';

const MovieForm = ({ initialValues, onSubmit, isEdit = false }) => {
  const dispatch = useDispatch();
  const actors = useSelector(selectAllActors);
  const producers = useSelector(selectAllProducers);
  const [selectedActors, setSelectedActors] = useState([]);
  const [newActor, setNewActor] = useState({
    name: '',
    gender: '',
    dob: null,
    bio: ''
  });
  const [newProducer, setNewProducer] = useState({
    name: '',
    gender: '',
    dob: null,
    bio: ''
  });
  const [showNewProducerForm, setShowNewProducerForm] = useState(false);
  const [showNewActorForm, setShowNewActorForm] = useState(false);

  useEffect(() => {
    dispatch(fetchActors());
    dispatch(fetchProducers());
  }, [dispatch]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    yearOfRelease: Yup.number()
      .required('Required')
      .min(1888, 'Too early for movies')
      .max(new Date().getFullYear() + 2, 'Cannot be in future'),
    plot: Yup.string().required('Required'),
    poster: Yup.string()
      .required('Required')
      .url('Must be a valid URL')
      .matches(/\.(jpeg|jpg|png|webp)$/, 'Must be an image URL'),
    producer: Yup.string().required('Required')
  });

  const formik = useFormik({
    initialValues: initialValues
      ? {
        ...initialValues,
        producer: initialValues.producer?._id || '',
        actors: initialValues.actors?.map(actor => actor._id) || [],
      }
      : {
        name: '',
        yearOfRelease: '',
        plot: '',
        poster: '',
        producer: '',
        actors: [],
      },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const movieData = {
        ...values,
        actors: values.actors,
      };
      await onSubmit(movieData);
      if (!isEdit) {
        resetForm();
        setSelectedActors([]);
      }
    },
  });

  const handleAddNewActor = async () => {
    if (newActor.name.trim()) {
      try {
        const formattedActor = {
          ...newActor,
          dob: newActor.dob ? new Date(newActor.dob).toISOString() : null
        };
        await dispatch(addActor(formattedActor)).unwrap();
        await dispatch(fetchActors());
        setNewActor({
          name: '',
          gender: '',
          dob: null,
          bio: ''
        });
        setShowNewActorForm(false);
      } catch (err) {
        console.error('Failed to add actor:', err);
      }
    }
  };
  
  const handleAddNewProducer = async () => {
    if (newProducer.name.trim()) {
      try {
        const formattedProducer = {
          ...newProducer,
          dob: newProducer.dob ? new Date(newProducer.dob).toISOString() : null
        };
        const result = await dispatch(addProducer(formattedProducer)).unwrap();
        await dispatch(fetchProducers());
        formik.setFieldValue('producer', result._id);
        setNewProducer({
          name: '',
          gender: '',
          dob: null,
          bio: ''
        });
        setShowNewProducerForm(false);
      } catch (err) {
        console.error('Failed to add producer:', err);
      }
    }
  };

  const handleActorFieldChange = (field, value) => {
    setNewActor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProducerFieldChange = (field, value) => {
    setNewProducer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        p: 4,
        backgroundColor: '#f5f5f5'
      }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
            {isEdit ? 'Edit Movie' : 'Add New Movie'}
          </Typography>

          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={4}>
              {/* Movie Details Section */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Movie Details
                </Typography>

                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Movie Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  id="yearOfRelease"
                  name="yearOfRelease"
                  label="Year of Release"
                  type="number"
                  value={formik.values.yearOfRelease}
                  onChange={formik.handleChange}
                  error={formik.touched.yearOfRelease && Boolean(formik.errors.yearOfRelease)}
                  helperText={formik.touched.yearOfRelease && formik.errors.yearOfRelease}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  id="plot"
                  name="plot"
                  label="Plot"
                  multiline
                  rows={4}
                  value={formik.values.plot}
                  onChange={formik.handleChange}
                  error={formik.touched.plot && Boolean(formik.errors.plot)}
                  helperText={formik.touched.plot && formik.errors.plot}
                  sx={{ mb: 3 }}
                />
              </Grid>

              {/* Poster and Producer Section */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Media & Production
                </Typography>

                <TextField
                  fullWidth
                  id="poster"
                  name="poster"
                  label="Poster URL"
                  value={formik.values.poster}
                  onChange={formik.handleChange}
                  error={formik.touched.poster && Boolean(formik.errors.poster)}
                  helperText={formik.touched.poster && formik.errors.poster}
                  sx={{ mb: 3 }}
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="producer-label">Producer</InputLabel>
                  <Select
                    labelId="producer-label"
                    id="producer"
                    name="producer"
                    value={formik.values.producer}
                    onChange={formik.handleChange}
                    error={formik.touched.producer && Boolean(formik.errors.producer)}
                  >
                    {producers?.data?.map(producer => (
                      <MenuItem key={producer._id} value={producer._id}>
                        {producer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => setShowNewProducerForm(true)}
                  sx={{ mb: 3 }}
                >
                  Add New Producer
                </Button>

                {showNewProducerForm && (
                  <Paper elevation={2} sx={{ p: 3, mb: 3, borderLeft: '4px solid #3f51b5' }}>
                    <Typography variant="h6" gutterBottom>
                      Add New Producer
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name"
                          value={newProducer.name}
                          onChange={(e) => handleProducerFieldChange('name', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Gender</InputLabel>
                          <Select
                            value={newProducer.gender}
                            onChange={(e) => handleProducerFieldChange('gender', e.target.value)}
                            label="Gender"
                          >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Date of Birth"
                          value={newProducer.dob}
                          onChange={(date) => handleProducerFieldChange('dob', date)}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Biography"
                          multiline
                          rows={3}
                          value={newProducer.bio}
                          onChange={(e) => handleProducerFieldChange('bio', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={() => setShowNewProducerForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleAddNewProducer}
                          disabled={!newProducer.name.trim()}
                        >
                          Add Producer
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                )}
              </Grid>

              {/* Actors Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Cast
                </Typography>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="actor-label">Select Actors</InputLabel>
                  <Select
                    labelId="actor-label"
                    id="actors"
                    name="actors"
                    value={formik.values.actors}
                    onChange={formik.handleChange}
                    multiple
                    renderValue={(selected) => selected.map(actorId => {
                      const actor = actors?.data?.find(a => a._id === actorId);
                      return actor ? actor.name : '';
                    }).join(', ')}
                    error={formik.touched.actors && Boolean(formik.errors.actors)}
                  >
                    {actors?.data?.map((actor) => (
                      <MenuItem key={actor._id} value={actor._id}>
                        {actor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => setShowNewActorForm(true)}
                  sx={{ mb: 3 }}
                >
                  Add New Actor
                </Button>

                {showNewActorForm && (
                  <Paper elevation={2} sx={{ p: 3, mb: 3, borderLeft: '4px solid #3f51b5' }}>
                    <Typography variant="h6" gutterBottom>
                      Add New Actor
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name"
                          value={newActor.name}
                          onChange={(e) => handleActorFieldChange('name', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Gender</InputLabel>
                          <Select
                            value={newActor.gender}
                            onChange={(e) => handleActorFieldChange('gender', e.target.value)}
                            label="Gender"
                          >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Date of Birth"
                          value={newActor.dob}
                          onChange={(date) => handleActorFieldChange('dob', date)}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Biography"
                          multiline
                          rows={3}
                          value={newActor.bio}
                          onChange={(e) => handleActorFieldChange('bio', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={() => setShowNewActorForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleAddNewActor}
                          disabled={!newActor.name.trim()}
                        >
                          Add Actor
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                )}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    float: 'right'
                  }}
                >
                  {isEdit ? 'Update Movie' : 'Add Movie'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default MovieForm;