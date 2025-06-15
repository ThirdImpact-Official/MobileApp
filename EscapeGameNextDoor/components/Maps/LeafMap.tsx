
import React, { useEffect } from 'react';
import { MapContainer as Map, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { StyleSheet } from 'nativewind';

interface LeafMapProps {
    center: [number, number],
    zoom: number;
    scrollWheelZoom?: boolean;
    markers?: Array<{ position: [number, number], popupText: string }>;
    style?: React.CSSProperties;
}

const MapUpdate: React.FC<{center: [number, number], zoom: number}> = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);

        // This effect runs when the map is first rendered
        // You can add any additional map setup here if needed
        map.invalidateSize(); // Ensures the map is properly sized after rendering
    }, [center, zoom, map]);

    return null;
}
const LeafMap: React.FC<LeafMapProps> = ({ center, zoom, markers = [], scrollWheelZoom, style }) => {

    if (!center || !Array.isArray(center) || center.length !== 2) {
        console.error('Invalid center coordinates provided');
        return (
            <View style={styles.containerError}>
                <Text>Invalid map center coordinates provided.</Text>
            </View>
        );
    }

    return (
        <Map center={center} zoom={zoom} style={style} scrollWheelZoom={scrollWheelZoom || false}>
            <MapUpdate center={center} zoom={zoom} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {markers.map((marker, index) => (
                <Marker key={index} position={marker.position}>
                    <Popup>{marker.popupText}</Popup>
                </Marker>
            ))}
        </Map>
    );
};

const styles = StyleSheet.create({
    containerError: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -20 }, { translateY: -20 }],
    },
});
export default LeafMap;

