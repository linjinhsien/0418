import React, { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';

interface Props {
  onPlaceSelect: (placeName: string, placeId?: string) => void;
  defaultValue?: string;
  placeholder?: string;
}

export const PlaceAutocomplete = ({ onPlaceSelect, defaultValue = '', placeholder }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    if (!(places as any).PlaceAutocompleteElement) {
      console.warn('Google Maps PlaceAutocompleteElement is not available.');
      return;
    }

    const autocompleteElement = new (places as any).PlaceAutocompleteElement();
    
    // 支援 Placeholder
    if (placeholder) {
      autocompleteElement.setAttribute('placeholder', placeholder);
    }

    autocompleteElement.classList.add('premium-autocomplete-element');
    
    autocompleteElement.addEventListener('gmp-select', async (event: any) => {
      const placePrediction = event.placePrediction;
      if (!placePrediction) return;

      const place = placePrediction.toPlace();
      await place.fetchFields({ fields: ['displayName', 'formattedAddress'] });
      
      const name = place.displayName || place.formattedAddress || '';
      onPlaceSelect(name, place.id);
    });

    containerRef.current.appendChild(autocompleteElement);
  }, [places, onPlaceSelect, placeholder]);

  return (
    <div className="relative w-full autocomplete-group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none icon-transition">
        <MapPin className="w-4 h-4" />
      </div>
      <div ref={containerRef} className="autocomplete-wrapper-custom" />
      <style>{`
        .autocomplete-wrapper-custom {
          width: 100%;
          min-height: 3rem;
        }
        .autocomplete-wrapper-custom gmp-place-autocomplete {
          width: 100%;
        }
        .autocomplete-wrapper-custom gmp-place-autocomplete::part(input) {
          padding: 0.75rem 1rem 0.75rem 3rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #f8fafc;
          font-family: inherit;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .autocomplete-wrapper-custom gmp-place-autocomplete::part(input):focus {
          border-color: #3b82f6;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .autocomplete-group:focus-within .icon-transition {
          color: #3b82f6;
        }
      `}</style>
    </div>
  );
};
