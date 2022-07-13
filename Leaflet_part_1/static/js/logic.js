// Defiine earthquakes GeoJson URL 
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create earthquake layerGroup
var earthquakes = L.layerGroup();

// Create tile layer
var grayScaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY   
});

// Create the map, adding the grayScaleMap and earthquakes layers to be dispalyed after loading
var myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 2,
    layers: [grayScaleMap, earthquakes]
});

