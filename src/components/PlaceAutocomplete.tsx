import React, { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';

interface Props {
  onPlaceSelect: (placeName: string) => void;
  defaultValue?: string;
  placeholder?: string;
}

export const PlaceAutocomplete = ({ onPlaceSelect, defaultValue = '', placeholder }: Props) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['name', 'formatted_address'],
    };

    const autocomplete = new places.Autocomplete(inputRef.current, options);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const placeName = place.name || place.formatted_address || '';
      setInputValue(placeName);
      onPlaceSelect(placeName);
    });
  }, [places]);

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <MapPin className="w-4 h-4" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => onPlaceSelect(inputValue)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
    </div>
  );
};
