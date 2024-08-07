import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = ({ locations, route, initialCenter }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routingControlRef = useRef(null);
  const markersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(initialCenter, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
      setMapReady(true);
    }
  }, []);

  useEffect(() => {
    if (!mapReady) return;

    // Clear existing route
    if (routingControlRef.current) {
      mapInstanceRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => mapInstanceRef.current.removeLayer(marker));
    markersRef.current = [];

    // Add markers for all locations
    route.forEach((location, index) => {
      const isChainLocation = location.name && location.name.includes(' - ');
      const markerColor = isChainLocation ? 'orange' : (index === 0 ? 'green' : (index === route.length - 1 ? 'red' : 'blue'));
      const markerIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style='background-color:${markerColor};' class='marker-pin'></div><i class='fa fa-${isChainLocation ? 'store' : 'map-marker'} awesome'></i>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      });
      
      const marker = L.marker([location.lat, location.lng], {icon: markerIcon}).addTo(mapInstanceRef.current)
        .bindPopup(isChainLocation ? location.name : (index === 0 ? 'Start' : (index === route.length - 1 ? 'End' : `Stop ${index}`)));
      markersRef.current.push(marker);
    });

    // If we have a route, create a new routing control
    if (route.length > 1) {
      const waypoints = route.map(location => L.latLng(location.lat, location.lng));
      
      routingControlRef.current = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: true,
        lineOptions: {
          styles: [{ color: '#6FA1EC', weight: 4 }]
        },
        createMarker: function() { return null; } // Don't create default markers, we're using custom ones
      }).addTo(mapInstanceRef.current);

      // Fit the map to show all route points
      const bounds = L.latLngBounds(waypoints);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (locations.length > 0) {
      // If no route but we have locations, fit the map to show all locations
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // If no route and no locations, center on the initial center
      mapInstanceRef.current.setView(initialCenter, 13);
    }
  }, [mapReady, locations, route, initialCenter]);

  return (
    <>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
      <style jsx>{`
        .custom-div-icon .marker-pin {
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -15px 0 0 -15px;
        }

        .custom-div-icon i {
          position: absolute;
          width: 22px;
          font-size: 22px;
          left: 0;
          right: 0;
          margin: 10px auto;
          text-align: center;
        }

        .custom-div-icon i.awesome {
          color: #fff;
          margin: 12px auto;
          font-size: 17px;
        }
      `}</style>
    </>
  );
};

export default Map;