import React, { useState, useEffect, useRef } from 'react';

const LocationInput = ({ onAddLocation, userLocation, initialValue }) => {
  const [query, setQuery] = useState(initialValue || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  useEffect(() => {
    setQuery(initialValue || '');
  }, [initialValue]);

  const searchLocations = async (input) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Cancel any ongoing fetch
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const [lat, lon] = userLocation;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=5&viewbox=${lon-0.1},${lat-0.1},${lon+0.1},${lat+0.1}&bounded=1`,
        { signal: abortControllerRef.current.signal }
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching suggestions:", error);
        setError('Failed to fetch suggestions. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setQuery(input);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      searchLocations(input);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    onAddLocation({
      address: suggestion.display_name,
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    });
    setQuery(suggestion.display_name);
    setSuggestions([]);
  };

  return (
    <div className="mb-4 relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a location"
        className="border p-2 w-full"
      />
      {isLoading && <p className="text-sm text-gray-500">Loading suggestions...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1">
          {suggestions.map((suggestion) => (
            <li 
              key={suggestion.place_id} 
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;