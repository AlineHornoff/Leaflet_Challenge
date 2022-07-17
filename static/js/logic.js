// Define earthquakes GeoJson URL 
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Create earthquake and tectonicPlates layerGroup
var earthquakes = L.layerGroup();
var tectonicPlates = L.layerGroup();

// Create tile layers
var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

var grayScaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY   
});

var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

// Define baseMaps opject to hold the base layers
var baseMaps = {
    "Satallite Map": satelliteMap,
    "Grayscale Map": grayScaleMap,
    "Outdoors Map": outdoorsMap,
};

// Create overlay object to hold overlay layer
var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonicPlates,
};

// Create the map, adding the satelliteMap and earthquakes layers to be dispalyed after loading
var myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 2,
    layers: [satelliteMap, earthquakes]
});

// Create a layer control, pass in baseMap and overlayMaps, includes layer control
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Get geoJson data
d3.json(earthquakesURL, function(earthquakeData) {
    // Set marker size by magnitude
    function markerSize(magnitude){
        return magnitude * 4;
    };

    // Set marker color by depth
    function chooseColor(depth) {
        switch(true) {
            case depth > 5:
                return "red";
            case depth > 4:
                return "orangered";
            case depth > 3:
                return "orange";
            case depth > 2:
                return "gold";
            case depth > 1:
                return "yellow";
            default:
                return "lightgreen";
        }
    }

    // Create GeoJson layer containing features array including popup indicating place and time of earthquake
    L.geoJson(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng,
                // Set style of markers based on properties.mag
                {
                    radius: markerSize(feature.properties.mag),
                    fillColor: chooseColor(feature.geometry.coordinates[2]),
                    fillOpacity: 0.7,
                    color: "black",
                    stroke: true,
                    weight: 0.5
                }
                );
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
            + new Date(feature.properties.time) + "</p><hr>Magnitude: " + feature.properties.mag + "</p>");
        }
    }).addTo(earthquakes);

    // Send earthquakes layer to createMap function
    earthquakes.addTo(myMap);

    // Add tectonic plate data from tectonicPlatesURL
    d3.json(tectonicPlatesURL, function(data) {
        L.geoJson(data, {
            color: "orange",
            weight: 2
        }).addTo(tectonicPlates);
        tectonicPlates.addTo(myMap);
    });

    // Add a legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        depth = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h3 style='text-align: center'>Magnitude</h3"
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
            '<i style="background:' + chooseColor(depth[i] + 1) +'"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
});