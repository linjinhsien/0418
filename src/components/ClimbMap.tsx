import React, { useEffect, useState } from 'react';
import { Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

interface Props {
  locationName: string;
  locationId?: string | null;
}

export const ClimbMap = ({ locationName, locationId }: Props) => {
  const map = useMap();
  const places = useMapsLibrary('places');
  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    if (!places || !map) return;

    const fetchPosition = async () => {
      try {
        const { Place } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;
        
        if (locationId) {
          const place = new Place({ id: locationId });
          await place.fetchFields({ fields: ['location'] });
          
          if (place.location) {
            const loc = place.location.toJSON();
            setPosition(loc);
            map.setCenter(loc);
            map.setZoom(15);
            return;
          }
        } else if (locationName) {
          // 回退機制：根據名稱進行文本搜尋
          const { places: foundPlaces } = await Place.searchByText({
            textQuery: locationName,
            fields: ['location'],
            maxResultCount: 1
          });

          if (foundPlaces && foundPlaces.length > 0 && foundPlaces[0].location) {
            const loc = foundPlaces[0].location.toJSON();
            setPosition(loc);
            map.setCenter(loc);
            map.setZoom(14);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch place location:', err);
      }
    };

    fetchPosition();
  }, [places, locationName, locationId, map]);

  return (
    <div className="w-full h-56 rounded-2xl overflow-hidden border border-white-10 shadow-inner bg-slate-900 mt-3">
      <Map
        defaultCenter={{ lat: 23.6, lng: 121 }} // 預設台灣中心
        defaultZoom={7}
        mapId="df149255a011a687"
        disableDefaultUI={true}
      >
        {position && <AdvancedMarker position={position} />}
      </Map>
    </div>
  );
};
