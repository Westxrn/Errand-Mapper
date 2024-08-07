# Errand Mapper

Errand Mapper is an intelligent route optimization application that helps users plan efficient routes for their errands, including visits to chain stores and specific locations.

## APIs Used

1. **Overpass API**: Used to fetch real-world data about nearby chain stores and locations based on the user's current position.

2. **OpenStreetMap Nominatim API**: Used for geocoding, converting addresses into geographic coordinates.

3. **OSRM (Open Source Routing Machine) API**: Used for calculating distances and optimal routes between locations.

## Frameworks and Libraries

1. **React**: The core library used for building the user interface.

2. **Leaflet**: An open-source JavaScript library for mobile-friendly interactive maps.

3. **React-Leaflet**: React components for Leaflet maps.

4. **Leaflet Routing Machine**: A Leaflet plugin for finding and displaying routes on the map.

5. **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

## Application Description

### Main Purpose

Errand Mapper is designed to optimize multi-stop routes for users running errands or planning trips. Its main purposes are:

1. Allow users to input start and end locations, along with intermediate stops.
2. Enable selection of chain stores (e.g., pharmacies, fast food restaurants) without specifying exact locations.
3. Calculate the most efficient route that includes all specified stops and selected chain stores.
4. Visually display the optimized route on an interactive map.

### Unique Features

1. **Chain Store Integration**: Unlike typical routing apps, Errand Mapper allows users to include chain stores in their route without specifying exact locations. The app intelligently selects the most optimal location of the chain to visit based on the overall route.

2. **Real-time Chain Store Data**: The application fetches real-world data about nearby chain stores, providing users with up-to-date and location-relevant options.

3. **Flexible Route Optimization**: The app considers both specific locations and chain stores when calculating the optimal route, offering a unique blend of precision and flexibility in route planning.

4. **Interactive Map Visualization**: Users can see their optimized route on an interactive map, with color-coded markers distinguishing between start, end, intermediate, and chain store stops.

5. **User-friendly Interface**: The application offers an intuitive interface for adding locations and selecting chain stores, making complex route planning accessible to all users.

### Why It's Unique

Errand Mapper stands out by bridging the gap between specific location-based routing and the real-world need for flexibility when running errands. By incorporating chain store selection without requiring exact addresses, it mimics how people actually plan their errands – knowing they need to visit a type of store (e.g., a pharmacy) without having a specific branch in mind.

This approach saves users time in planning, as they don't need to look up and input addresses for chain stores. It also potentially saves time in execution by optimizing which specific branch of a chain to visit based on the overall route.

The combination of specific locations and chain stores in route optimization, backed by real-world data and presented on an interactive map, makes Errand Mapper a unique and powerful tool for everyday route planning and optimization.
