import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Pagination,
  CircularProgress,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
} from '@mui/material';
import Chip from '@mui/material/Chip';

interface Movie {
  id: string;
  title: string;
  genres: string[];
  cast: string[];
  plot: string;
  directors: string[];
  imdb: {
    rating: number;
    votes: number;
  };
}
interface EditMovie {
  id: string;
  title: string;
  genres: string[];
  cast: string[];
  plot: string;
  directors: string[];
  imdb: {
    rating: string;
    votes: number;
  };
}

const moviesPerPage = 10;

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [detailedMovieInfo, setDetailedMovieInfo] = useState<Movie | null>(null);
  const [editedMovieInfo, setEditedMovieInfo] = useState<EditMovie | null>(null);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:5284/movies')
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        setIsLoading(false);
      });
  }, []);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const openPopup = async (movie: Movie) => {
    try {

      setIsLoading(true);
      fetch(`http://localhost:5284/movies/${movie.id}`)
        .then((response) => response.json())
        .then((data) => {
          setEditedMovieInfo(data);
          setDetailedMovieInfo(data);
          setIsLoading(false);
        });


      setIsPopupOpen(true);
    } catch (error) {
      console.error(error);
      // Handle error, e.g., show an error message
    }
  };

  const handleAdd = (field: keyof Movie) => {
    // Here you can implement the logic for adding a new item.
    // You can use a prompt to get the new item from the user.
    const newItem = prompt(`Enter new ${field}`);
    if (newItem) {
      setEditedMovieInfo((prevInfo) => {
        if (!prevInfo) return null;
        let updatedField;
        if (Array.isArray(prevInfo[field])) {
          updatedField = [...(prevInfo[field] as string[]), newItem];
        } else {
          updatedField = newItem;
        }
        return { ...prevInfo, [field]: updatedField };
      });
    }
  };
  
  const handleDelete = (field: keyof Movie, index: number) => {
    setEditedMovieInfo((prevInfo) => {
      if (!prevInfo) return null;
      return {
        ...prevInfo,
        [field]: Array.isArray(prevInfo[field]) ? (prevInfo[field] as string[]).filter((_, i) => i !== index) : prevInfo[field],
      };
    });
  };

  const handleInputChange = (field: keyof Movie, value: string | number | string[] | { rating: string, votes: number }) => {
    setEditedMovieInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
      id: prevInfo?.id || '',
      title: field === 'title' && typeof value === 'string' ? value : (prevInfo?.title || ''),
      genres: field === 'genres' && Array.isArray(value) ? value : (prevInfo?.genres || []),
      cast: field === 'cast' && Array.isArray(value) ? value : (prevInfo?.cast || []),
      plot: field === 'plot' && typeof value === 'string' ? value : (prevInfo?.plot || ''),
      directors: field === 'directors' && Array.isArray(value) ? value : (prevInfo?.directors || []),
      imdb: field === 'imdb' && typeof value === 'object' && 'rating' in value && 'votes' in value ? value : (prevInfo?.imdb || { rating: '', votes: 0 }),
    }));


  };
  const saveChanges = async () => {

    try {
      const response = await fetch(`http://localhost:5284/movies/${editedMovieInfo?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editedMovieInfo,
          imdb: {
            ...editedMovieInfo?.imdb,
            rating: Number(editedMovieInfo?.imdb.rating),
            votes: Number(editedMovieInfo?.imdb.votes)
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      // Optionally, you can update the state or perform other actions after successful save
      // For example, you can refetch the updated movie details

      setIsPopupOpen(false);

      setIsLoading(true);
      fetch('http://localhost:5284/movies')
        .then((response) => response.json())
        .then((data) => {
          setMovies(data);
          setIsLoading(false);
        });
 
    } catch (error) {
      console.error(error);
      // Handle error, e.g., show an error message
    }
  };

  const closePopup = () => {
    setSelectedMovie(null);
    setIsPopupOpen(false);
  };

  return (
    <Box sx={{
      minWidth: '100%',
      
    }} >
      <header className="App-header">
        <Typography variant="h4" component="div" gutterBottom>
          IMDb Top Movies
        </Typography>
        {isLoading && <CircularProgress/>}
        <Grid container spacing={2} flexDirection="column" alignContent="center">
          {currentMovies.map((movie) => (
            <Grid 
            item key={movie.id} 
            style={{ width: '60%', minHeight: '100%' }}
            onClick={() => openPopup(movie)}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    IMDb Rating: {movie.imdb.rating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Genres: {movie.genres ? movie.genres.join(', ') : "-"}
                  </Typography>

                  {/* Add more details as needed */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {!isLoading && 
        <Pagination
          count={Math.ceil(movies.length / moviesPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          variant="outlined" 
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': {
              color: 'white',
              margin: '10px',
            },
          }}
        />
      }
      </header>

      <Dialog open={isPopupOpen} onClose={closePopup} >
        <DialogTitle>Edit Movie: {editedMovieInfo?.title}</DialogTitle>
        <DialogContent>
          <TextField
            label="ID"
            value={editedMovieInfo?.id || ''}
            disabled
            fullWidth
            margin="normal"
          />
          <TextField
            label="Title"
            value={editedMovieInfo?.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            fullWidth
            margin="normal"
          />
          <Typography variant="body2" color="text.secondary">
            Genres
          </Typography>
          {editedMovieInfo?.genres.map((genre, index) => (
            <Chip
              key={index}
              label={genre}
              onDelete={() => handleDelete('genres', index)}
            />
          ))}
          <Button onClick={() => handleAdd('genres')}>Add Genre</Button>
          <Typography variant="body2" color="text.secondary">
            Cast
          </Typography>
          {editedMovieInfo?.cast.map((cast, index) => (
            <Chip
              key={index}
              label={cast}
              onDelete={() => handleDelete('cast', index)}
            />
          ))}
          <Button onClick={() => handleAdd('cast')}>Add Cast</Button>
          <TextField
            label="Plot"
            value={editedMovieInfo?.plot || ''}
            onChange={(e) => handleInputChange('plot', e.target.value)}
            fullWidth
            margin="normal"
          />
          <Typography variant="body2" color="text.secondary">
            Directors
          </Typography>
          {editedMovieInfo?.directors.map((directors, index) => (
            <Chip
              key={index}
              label={directors}
              onDelete={() => handleDelete('directors', index)}
            />
          ))}
          <Button onClick={() => handleAdd('directors')}>Add Directors</Button>
          <TextField
            label="IMDB Rating"
            value={editedMovieInfo?.imdb.rating || ''}
            onChange={(e) => handleInputChange('imdb', { rating: String(e.target.value) || '', votes: Number(editedMovieInfo?.imdb.votes) || 0 })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="IMDB Votes"
            value={editedMovieInfo?.imdb.votes || 0}
            onChange={(e) => handleInputChange('imdb', { rating: String(editedMovieInfo?.imdb.rating) || '', votes: Number(e.target.value) || 0 })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={saveChanges} color="primary">
            Save Changes
          </Button>
          <Button onClick={closePopup} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
    </Box>
  );
}

export default App;
