const calculateRoadDistance = async (point1, point2) => {
    const url = `http://router.project-osrm.org/route/v1/driving/${point1.lng},${point1.lat};${point2.lng},${point2.lat}?overview=false`;
    const response = await fetch(url);
    const data = await response.json();
    return data.routes[0].distance / 1000; // Convert to km
  };
  
  export const calculateShortestRoute = async (locations) => {
    const n = locations.length;
    const visited = new Array(n).fill(false);
    const route = [locations[0]];
    visited[0] = true;
  
    for (let i = 1; i < n; i++) {
      let nextIndex;
      let minDistance = Infinity;
  
      for (let j = 0; j < n; j++) {
        if (!visited[j]) {
          const distance = await calculateRoadDistance(route[route.length - 1], locations[j]);
          if (distance < minDistance) {
            minDistance = distance;
            nextIndex = j;
          }
        }
      }
  
      route.push(locations[nextIndex]);
      visited[nextIndex] = true;
    }
  
    return route;
  };