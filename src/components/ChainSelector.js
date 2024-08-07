import React, { useState, useEffect } from 'react';

const ChainSelector = ({ onAddChain, userLocation, selectedChains, setSelectedChains }) => {
  const [chains, setChains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNearbyChains = async () => {
      setIsLoading(true);
      try {
        const [lat, lon] = userLocation;
        const radius = 5000; // 5km radius
        const query = `
          [out:json];
          (
            node["brand"]["name"](around:${radius},${lat},${lon});
            way["brand"]["name"](around:${radius},${lat},${lon});
            relation["brand"]["name"](around:${radius},${lat},${lon});
          );
          out tags;
        `;
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query
        });
        const data = await response.json();
        const uniqueChains = [...new Set(data.elements.map(element => element.tags.brand))];
        setChains(uniqueChains.filter(Boolean).sort());
      } catch (error) {
        console.error("Error fetching nearby chains:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userLocation[0] !== 0 && userLocation[1] !== 0) {
      fetchNearbyChains();
    }
  }, [userLocation]);

  const handleChainSelect = (chain) => {
    if (!selectedChains.includes(chain)) {
      const newSelectedChains = [...selectedChains, chain];
      setSelectedChains(newSelectedChains);
      onAddChain(chain);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Select Chain Locations</h3>
      {isLoading ? (
        <p>Loading nearby chains...</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {chains.map((chain) => (
            <button
              key={chain}
              onClick={() => handleChainSelect(chain)}
              className={`px-3 py-1 rounded ${
                selectedChains.includes(chain)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {chain}
            </button>
          ))}
        </div>
      )}
      {selectedChains.length > 0 && (
        <div className="mt-2">
          <h4 className="text-sm font-semibold">Selected Chains:</h4>
          <ul className="list-disc list-inside">
            {selectedChains.map((chain) => (
              <li key={chain} className="text-sm">{chain}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChainSelector;