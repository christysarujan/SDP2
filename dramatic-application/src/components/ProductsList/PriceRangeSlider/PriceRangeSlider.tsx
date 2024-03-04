// PriceRangeSlider.tsx

import React from 'react';
import InputRange, { Range } from 'react-input-range';
import 'react-input-range/lib/css/index.css';

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  value: { min: number; max: number };
  onChange: (value: number | Range) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ minPrice, maxPrice, value, onChange }) => {
  return (
    <div className="price-range-slider">
      <InputRange
        minValue={minPrice}
        maxValue={maxPrice}
        value={value}
        onChange={onChange}
        formatLabel={value => `${value} Rs`}
      />
    </div>
  );
};

export default PriceRangeSlider;
