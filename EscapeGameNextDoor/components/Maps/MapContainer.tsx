import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import { UnitofAction } from '@/action/UnitofAction';
import { MapContainer as Map } from 'react-leaflet';

interface PropsWithChildren {
    center: [number, number],
    zoom: number,
    scrollWheelZoom?: boolean,
    style?: React.CSSProperties
}

const MapContainer: React.FC<PropsWithChildren> = ({
    center,
    zoom,
    scrollWheelZoom,
    style,
}) => {
    if (Platform.OS === 'web') {
        const LazyloadWebView = React.lazy(() => import('./LeafMap'));
        return (
            <React.Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
                <LazyloadWebView
                    center={center}
                    zoom={zoom}
                    scrollWheelZoom={scrollWheelZoom || false}
                    style={style}
                />
            </React.Suspense>
        );
    } else {

        const htmlContent = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8" />
                            <title>Map</title>
                            <style>
                                body { margin: 0; padding: 0; }
                                #map { width: 100%; height: 100vh; }
                            </style>
                        </head>
                        <body>
                            <div id="map"></div>
                            <script>
                                var map = L.map('map').setView([${center[0]}, ${center[1]}], ${zoom});
                                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                    maxZoom: 19,
                                }).addTo(map);
                            </script>
                        </body>
                        </html>
        `;
        return (
            <View style={[styles.container]}>
                <WebView
                    source={{ html: htmlContent }}
                    style={{ width: '100%', height: '100%' }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
                    )}
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    WebView: {
        flex: 1,
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -20 }, { translateY: -20 }],
    },
});
export default MapContainer;