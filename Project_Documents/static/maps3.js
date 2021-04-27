// id="selDataset" in the index.html
var selection = d3.select("#selDataset")
var myMap = null;
var layerLookup = {};

var causeDeath = ["UnsafeWater", "Sanitation", "Handwash"];

  causeDeath.forEach((death) => {
    selection
      .append("option")
      .property("value", death)
      .text(death)
      .classed("option-list-item",true);
  });
  
  
  // Adding the tile layer
  var topo = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

var promises = [d3.json('http://127.0.0.1:5000/api/v1.0/country_coords'), d3.json('http://127.0.0.1:5000/api/v1.0/water_data')]
var test = true;
var activeLayer = null;

// Initialize the dashboard to start at Unsafe Water Source

function optionChanged(deathCause) {
    if(activeLayer) {
      myMap.removeLayer(activeLayer);
    }
    activeLayer = layerLookup[deathCause];
    myMap.addLayer(activeLayer);
}

function init() {

  Promise.all(promises).then(values => {
    var geoJson = values[0];
    var csv = values[1];
    console.log(csv)
    geoJson.features.forEach(geoJsonDataPoint => {
        var countryCode = geoJsonDataPoint.properties.ISO_A3;
        var countryData = csv.filter(x => x.code === countryCode)
        if (countryData[0]) {
            Object.entries(countryData[0]).forEach((d) => {
                geoJsonDataPoint.properties[d[0]] = d[1];
            })
        }
    })

    // Create a new choropleth layer.
    UnsafeWater = L.choropleth(geoJson, {

    // Define which property in the features to use. Needs to be variable based on dropdown selection
    valueProperty: "unsafe_water_perct",

    // Set the color scale.
    scale: ["#E0FFFF", "#00008B"],

    // The number of breaks in the step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a popup to each layer - needs to be variable based on dropdown selection
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Country: " + feature.properties.country_name + "<br>Cause of Death %:<br>" +
      Math.round(feature.properties.unsafe_water_perct*100)/100 + "%");
    }
  })

    // Create a new choropleth layer.
    Sanitation = L.choropleth(geoJson, {

      // Define which property in the features to use. Needs to be variable based on dropdown selection
      valueProperty: "unsafe_sanitation_perct",
  
      // Set the color scale.
      scale: ["#E0FFFF", "#00008B"],
  
      // The number of breaks in the step range
      steps: 10,
  
      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },
  
      // Binding a popup to each layer - needs to be variable based on dropdown selection
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Country: " + feature.properties.country_name + "<br>Cause of Death %:<br>" +
         Math.round(feature.properties.unsafe_sanitation_perct*100)/100) + "%";
      }
    })

    // Create a new choropleth layer.
    Handwash = L.choropleth(geoJson, {

      // Define which property in the features to use. Needs to be variable based on dropdown selection
      valueProperty: "no_handwashing_perct",
  
      // Set the color scale.
      scale: ["#E0FFFF", "#00008B"],
  
      // The number of breaks in the step range
      steps: 10,
  
      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },
  
      // Binding a popup to each layer - needs to be variable based on dropdown selection
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Country: " + feature.properties.country_name + "<br>Cause of Death %:<br>" +
        Math.round(feature.properties.no_handwashing_perct*100)/100 + "%");
      }
    })
  
    // These JSON keys map directly to the OPTION values in the SELECT dropdown
    layerLookup = {
      "Sanitation": Sanitation,
      "UnsafeWater": UnsafeWater,
      "Handwash": Handwash
    };

    // Only one base layer can be shown at a time.
    var baseMaps = {
      Topography: topo
    };

    // Overlays that can be toggled on or off
    var overlayMaps = {
      "Unsafe Water": UnsafeWater,
      "Sanitation" : Sanitation,
      "No Handwashing" : Handwash
    };


    // Create a map object, and set the default layers.
    myMap = L.map("map1", {
      center: [32.7502, 45.7655],
      zoom: 2,
      layers: [topo, UnsafeWater]
    });
  

    // Pass our map layers into our layer control.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

        // Creating the map object
    var myMap2 = L.map("map2", {
      center: [32.7502, 45.7655],
      zoom: 2
    });

    // Adding the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap2);

      // Create a new choropleth layer.
      geojson = L.choropleth(geoJson, {

        // Define which property in the features to use.
        valueProperty: "safe_water_2017",

        // Set the color scale.
        scale: ["#E0FFFF", "#00008B"],

        // The number of breaks in the step range
        steps: 10,

        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
          // Border color
          color: "#fff",
          weight: 1,
          fillOpacity: 0.8
        },

        // Binding a popup to each layer
        onEachFeature: function (feature, layer) {
          layer.bindPopup("Country: " + feature.properties.country_name + "<br>Access to Clean Water:<br>" +
            Math.round(feature.properties.safe_water_2017*100)/100 + "%");
        }
      }).addTo(myMap2);

      // Set up the legend.
      var legend2 = L.control({
        position: "bottomright"
    });
  
    legend2.onAdd = function (map) {
        var div = L.DomUtil.create("div", "info legend");
  
        var grades2 = geojson.options.limits;
        var colors2 = geojson.options.colors;
  
        // Looping through our intervals to generate a label with a colored square for each interval.
        for (var i = 0; i < grades2.length; i++) {
            div.innerHTML += "<i style='background: " + colors2[i] + "'></i> "
                + grades2[i] + (grades2[i + 1] ? "&ndash;" + grades2[i + 1] + "<br>" : "+");
        }
        return div;
      };

      // Adding the legend to the map
      legend2.addTo(myMap2);
      legend.addTo(myMap);



    })


    // worked on legend with tutor
    var legend = L.control({
      position: "bottomright"
  });

  legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend");

      var grades = geojson.options.limits;
      var colors = geojson.options.colors;

      // Looping through our intervals to generate a label with a colored square for each interval.
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
              + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(myMap);


}

init();

optionChanged(causeDeath[0]);

