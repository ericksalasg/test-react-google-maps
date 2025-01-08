'use client';

import { useEffect, useRef, useState } from 'react';
import {APIProvider, Map, AdvancedMarker, useMap} from '@vis.gl/react-google-maps';
import { MarkerClusterer, type Marker } from '@googlemaps/markerclusterer';

import properties from "@/data/properties"


export default function MyMap() {
  return (
    <div style={{height: '100vh', width: '100vw'}}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
        <Map
          mapId={'bf51a910020fa25a'}
          defaultZoom={10}
          defaultCenter={{lat: 43.64, lng: -79.41}}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
            <Markers points={properties}/>
        </Map>
        </APIProvider>
    </div>
  );
}

type Point = google.maps.LatLngLiteral & {key: string};
type Props = { points: Point[] };

const Markers = ({points}: Props) => {
    const map = useMap();
    const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
    const clusterer = useRef<MarkerClusterer | null>(null);

    useEffect(() => {
      if(!map) return;
    
      if(!clusterer.current) {
        clusterer.current = new MarkerClusterer({map})
      }
    }, [map])

    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers])
    
    const setMarkerRef = (marker: Marker | null, key: string) => {

        if(marker && markers[key]) return;
        if(!marker && !markers[key]) return;

        setMarkers((prev) => {
            if(marker) {
               return {...prev, [key]: marker};
            } else {
                const newMarkers = {...prev};
                delete newMarkers[key];
                return newMarkers;
            }
        }); 
    }

    return (
        <>
           { points.map((point) => ( 
            <AdvancedMarker key={point.key} position={point} ref={marker => setMarkerRef(marker, point.key)} >
                <span style={{fontSize: '24px'}}>🏠</span>
            </AdvancedMarker>
             ))}
        </>
    );
};