// utils/routeOptimizer.js
const calculateDistance = async (point1, point2) => {
    const url = `http://router.project-osrm.org/route/v1/driving/${point1.lng},${point1.lat};${point2.lng},${point2.lat}?overview=false`;
    const response = await fetch(url);
    const data = await response.json();
    return data.routes[0].distance;
  };
  
  const getChainLocations = async (chain, userLocation) => {
    const [lat, lon] = userLocation;
    const radius = 5000; // 5km radius
    const query = `
      [out:json];
      (
        node["brand"="${chain}"](around:${radius},${lat},${lon});
        way["brand"="${chain}"](around:${radius},${lat},${lon});
        relation["brand"="${chain}"](around:${radius},${lat},${lon});
      );
      out center;
    `;
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });
    const data = await response.json();
    return data.elements.map(element => ({
      name: `${chain} - ${element.tags.name || 'Unnamed'}`,
      lat: element.lat || element.center.lat,
      lng: element.lon || element.center.lon
    }));
  };
  
  export const calculateOptimalRouteWithChains = async (start, end, intermediateLocations, chains, userLocation) => {
    let allLocations = [start, ...intermediateLocations];
  
    // Get locations for each chain
    for (const chain of chains) {
      const chainLocations = await getChainLocations(chain, userLocation);
      allLocations = allLocations.concat(chainLocations);
    }
  
    allLocations.push(end);
  
    const n = allLocations.length;
    const distances = Array(n).fill().map(() => Array(n).fill(Infinity));
  
    // Calculate distances between all points
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const distance = await calculateDistance(allLocations[i], allLocations[j]);
        distances[i][j] = distances[j][i] = distance;
      }
    }
  
    // Generate all possible permutations of intermediate locations and chain locations
    const permutations = getPermutations(allLocations.slice(1, -1));
  
    let shortestDistance = Infinity;
    let shortestRoute = null;
  
    for (const perm of permutations) {
      const route = [start, ...perm, end];
      let totalDistance = 0;
  
      for (let i = 0; i < route.length - 1; i++) {
        const from = allLocations.indexOf(route[i]);
        const to = allLocations.indexOf(route[i + 1]);
        totalDistance += distances[from][to];
      }
  
      if (totalDistance < shortestDistance) {
        shortestDistance = totalDistance;
        shortestRoute = route;
      }
    }
  
    return shortestRoute;
  };
  
  const getPermutations = (arr) => {
    if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : [arr];
    return arr.reduce(
      (acc, item, i) =>
        acc.concat(
          getPermutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(val => [
            item,
            ...val,
          ])
        ),
      []
    );
  };