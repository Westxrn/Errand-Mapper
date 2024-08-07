import React from 'react';

const RouteDisplay = ({ route }) => {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Shortest Route:</h2>
      <ol className="list-decimal list-inside">
        {route.map((location, index) => (
          <li key={index}>{location.address}</li>
        ))}
      </ol>
    </div>
  );
};

export default RouteDisplay;