import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface GenreFilterProps {
  options: string[];
  value: string[];
  onChange: (newValue: string[]) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ options, value, onChange }) => {
  return (
    <Autocomplete
      multiple
      options={options}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={(params) => <TextField {...params} variant="standard" label="Genres" />}
    />
  );
};

export default GenreFilter;