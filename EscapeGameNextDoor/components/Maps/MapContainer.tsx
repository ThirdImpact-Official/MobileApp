import React, { useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
// import LeafMap from './LeafMap'; // décommente si tu utilises ce composant pour le rendu web

interface WebViewLeafletMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  scrollWheelZoom?: boolean;
  style?: any;
  markerTitle?: string;
  markerDescription?: string;
  markers?: Array<{
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
  }>;
  onMapReady?: () => void;
  onMarkerPress?: (marker: {
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
  }) => void;
}

const WebViewLeafletMap: React.FC<WebViewLeafletMapProps> = ({
  latitude,
  longitude,
  zoom = 13,
  scrollWheelZoom = true,
  style,
  markerTitle,
  markerDescription,
  markers = [],
  onMapReady,
  onMarkerPress,
}) => {
  const webViewRef = useRef<WebView>(null);

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    isNaN(latitude) ||
    isNaN(longitude)
  ) {
    console.error('Coordonnées invalides:', { latitude, longitude });
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const allMarkers = [...markers];
  if (markerTitle || markerDescription) {
    allMarkers.unshift({
      latitude,
      longitude,
      title: markerTitle,
      description: markerDescription,
    });
  }

  const escapeString = (str: string) =>
    str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Leaflet Map</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    #map { height: 100vh; width: 100vw; }
    .custom-popup { font-size: 14px; line-height: 1.4; }
    .custom-popup strong { color: #333; display: block; margin-bottom: 4px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    try {
      var map = L.map('map', {
        center: [${latitude}, ${longitude}],
        zoom: ${zoom},
        scrollWheelZoom: ${scrollWheelZoom}
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      function sendMessage(type, data) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type, data }));
        }
      }

      var markers = [];
      ${allMarkers
        .map((marker, index) => {
          const title = marker.title ? escapeString(marker.title) : '';
          const description = marker.description
            ? escapeString(marker.description)
            : '';
          const popup = title || description
            ? `<div class="custom-popup">
                ${title ? `<strong>${title}</strong>` : ''}
                ${description ? `<div>${description}</div>` : ''}
              </div>`
            : '';
          return `
            var marker${index} = L.marker([${marker.latitude}, ${marker.longitude}])
              .addTo(map)
              ${popup ? `.bindPopup(\`${popup}\`)` : ''};

            marker${index}.on('click', function() {
              sendMessage('markerPress', {
                latitude: ${marker.latitude},
                longitude: ${marker.longitude},
                title: "${title}",
                description: "${description}"
              });
            });
            markers.push(marker${index});
          `;
        })
        .join('\n')}

      if (markers.length > 1) {
        var group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }

      setTimeout(() => {
        map.invalidateSize();
        sendMessage('mapReady', { center: map.getCenter(), zoom: map.getZoom() });
      }, 200);

      map.on('moveend', function() {
        sendMessage('mapMoved', { center: map.getCenter(), zoom: map.getZoom() });
      });

      window.addEventListener('resize', function() {
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      });
    } catch (e) {
      console.error('Erreur carte:', e);
      sendMessage('error', { message: e.message });
    }
  </script>
</body>
</html>
`;

  const handleMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      switch (message.type) {
        case 'mapReady':
          onMapReady?.();
          break;
        case 'markerPress':
          onMarkerPress?.(message.data);
          break;
        case 'error':
          console.error('Erreur WebView Map:', message.data.message);
          break;
        default:
          console.log('Message WebView:', message);
      }
    } catch (error) {
      console.error('Erreur parsing WebView:', error);
    }
  };

  if (Platform.OS === 'web') {
    // Remplace ceci par ton composant React web si nécessaire
    return (
      <View style={style || styles.container}>
        {/* <LeafMap ... /> */}
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={style || styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        scrollEnabled={false}
        bounces={false}
        onMessage={handleMessage}
        onError={({ nativeEvent }) =>
          console.warn('WebView error:', nativeEvent)
        }
        onHttpError={({ nativeEvent }) =>
          console.warn('WebView HTTP error:', nativeEvent)
        }
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default WebViewLeafletMap;
