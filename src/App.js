// App.js
import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import LocationInput from './components/LocationInput';
import ChainSelector from './components/ChainSelector';
import RouteDisplay from './components/RouteDisplay';
import { calculateOptimalRouteWithChains } from './utils/routeOptimizer';

function App() {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [intermediateLocations, setIntermediateLocations] = useState([]);
  const [selectedChains, setSelectedChains] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [userLocation, setUserLocation] = useState([0, 0]);
  const [locationStatus, setLocationStatus] = useState('Locating...');

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLocationStatus('Locating...');
      navigator.geolocation.getCurrentPosition(function(position) {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setLocationStatus('Location found');
      }, function(error) {
        console.error("Error getting user location:", error);
        setUserLocation([0, 0]);
        setLocationStatus('Could not find location. Using default map center.');
      });
    } else {
      setLocationStatus('Geolocation is not supported by your browser');
    }
  }, []);

  const addIntermediateLocation = (location) => {
    setIntermediateLocations([...intermediateLocations, location]);
  };

  const addChain = (chain) => {
    if (!selectedChains.includes(chain)) {
      setSelectedChains([...selectedChains, chain]);
    }
  };

  const calculateRoute = async () => {
    if (!startLocation || !endLocation) {
      alert("Please set both start and end locations.");
      return;
    }
    setIsCalculating(true);
    try {
      const optimizedPath = await calculateOptimalRouteWithChains(
        startLocation,
        endLocation,
        intermediateLocations,
        selectedChains,
        userLocation
      );
      setOptimizedRoute(optimizedPath);
    } catch (error) {
      console.error("Error calculating route:", error);
      alert("Error calculating route. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const clearAll = () => {
    setStartLocation(null);
    setEndLocation(null);
    setIntermediateLocations([]);
    setSelectedChains([]);
    setOptimizedRoute([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Errand Mapper</h1>
      <p className="text-sm text-gray-500 mb-4">{locationStatus}</p>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Start Location</h2>
        <LocationInput 
          onAddLocation={setStartLocation} 
          userLocation={userLocation} 
          initialValue={startLocation?.address}
        />
        {startLocation && (
          <p className="text-sm text-gray-600 mt-1">Start: {startLocation.address}</p>
        )}
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">End Location</h2>
        <LocationInput 
          onAddLocation={setEndLocation} 
          userLocation={userLocation}
          initialValue={endLocation?.address}
        />
        {endLocation && (
          <p className="text-sm text-gray-600 mt-1">End: {endLocation.address}</p>
        )}
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Intermediate Stops</h2>
        <LocationInput onAddLocation={addIntermediateLocation} userLocation={userLocation} />
        <ul className="mt-2">
          {intermediateLocations.map((location, index) => (
            <li key={index} className="text-sm text-gray-600">Stop {index + 1}: {location.address}</li>
          ))}
        </ul>
      </div>
      <ChainSelector 
        onAddChain={addChain} 
        userLocation={userLocation}
        selectedChains={selectedChains}
        setSelectedChains={setSelectedChains}
      />
      <div className="flex space-x-4 mt-4">
        <button
          onClick={calculateRoute}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          disabled={isCalculating || !startLocation || !endLocation}
        >
          {isCalculating ? 'Calculating...' : 'Calculate Optimal Route'}
        </button>
        <button
          onClick={clearAll}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          disabled={isCalculating}
        >
          Clear All
        </button>
      </div>
      <Map locations={[startLocation, ...intermediateLocations, endLocation].filter(Boolean)} route={optimizedRoute} initialCenter={userLocation} />
      <RouteDisplay route={optimizedRoute} />
    </div>
  );
}

export default App;