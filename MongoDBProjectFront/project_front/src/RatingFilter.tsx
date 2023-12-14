import React from 'react';
import { Slider, Typography } from '@mui/material';

interface RatingFilterProps {
  value: number[];
  onChange: (newValue: number[]) => void;
  min: number;
  max: number;
}

const RatingFilter: React.FC<RatingFilterProps> = ({ value, onChange, min, max }) => {
  return (
    <div>
      <Typography gutterBottom>IMDb Rating</Typography>
      <Slider
        value={value}
        onChange={(event, newValue) => onChange(newValue as number[])}
        valueLabelDisplay="auto"
        min={min}
        max={max}
      />
    </div>
  );
};

export default RatingFilter;