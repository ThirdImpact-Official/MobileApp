import React, { useEffect } from 'react';
import { MapContainer as Map, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

interface LeafMapProps {
    latitude: number;
    longitude: number;
    zoom: number;
    scrollWheelZoom?: boolean;
    style?: React.CSSProperties;
    markerTitle?: string;
    markerDescription?: string;
    markers?: Array<{
        latitude: number;
        longitude: number;
        title?: string;
        description?: string;
    }>;
}

const MapUpdate: React.FC<{center: [number, number], zoom: number}> = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
        // Ensures the map is properly sized after rendering
        map.invalidateSize();
    }, [center, zoom, map]);

    return null;
};

const LeafMap: React.FC<LeafMapProps> = ({ 
    latitude, 
    longitude, 
    zoom, 
    markers = [], 
    scrollWheelZoom = false, 
    style,
    markerTitle,
    markerDescription
}) => {
    const center: [number, number] = [latitude, longitude];
    
    // Validate coordinates
    if (typeof latitude !== 'number' || typeof longitude !== 'number' || 
        isNaN(latitude) || isNaN(longitude)) {
        console.error('Invalid center coordinates provided');
        return (
            <div style={styles.containerError}>
                <p>Invalid map center coordinates provided.</p>
            </div>
        );
    }

    // Prepare all markers (including the main marker if title/description provided)
    const allMarkers = [...markers];
    if (markerTitle || markerDescription) {
        allMarkers.unshift({
            latitude,
            longitude,
            title: markerTitle,
            description: markerDescription
        });
    }

    return (
        <Map 
            center={center} 
            zoom={zoom} 
            style={style || styles.container} 
            scrollWheelZoom={scrollWheelZoom}
        >
            <MapUpdate center={center} zoom={zoom} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {allMarkers.map((marker, index) => (
                <Marker 
                    key={index} 
                    position={[marker.latitude, marker.longitude]}
                >
                    <Popup>
                        {marker.title && <strong>{marker.title}</strong>}
                        {marker.title && marker.description && <br />}
                        {marker.description}
                    </Popup>
                </Marker>
            ))}
        </Map>
    );
};

// CSS-in-JS styles for web
const styles = {
    containerError: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center' as const,
        padding: '20px',
        minHeight: '200px'
    },
    container: {
        height: '400px',
        width: '100%'
    }
};

export default LeafMap;