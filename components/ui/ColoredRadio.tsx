import React from 'react';

interface ColoredRadioProps {
  name: string,
  color: string,
}

const ColoredRadio: React.FC<ColoredRadioProps> = ({ name, color }) => {
  return (
    <label className="block w-12 h-12 cursor-pointer text-lg select-none">
      <input
        className="absolute opacity-0 cursor-pointer react-toggle--checked:bg-blue-700"
        style={{ color: color }}
        value={color}
        name={name}
        type="radio"
      />
      <svg className="absolute w-12 h-12" fill={color} stroke="currentColor" viewBox="3 3 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" strokeWidth={0} fill={color} />
        <path className="checkmark" color="rgb(249, 250, 251)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </label>
  )
}

export default ColoredRadio;