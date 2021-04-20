// id="selDataset" in the index.html
var selection = d3.select("#selDataset")

var causeDeath = ["Unsafe Water Source", "Poor Sanitation", "No Access to Handwashing Facility"];

  causeDeath.forEach((death) => {
    selection
      .append("option")
      .property("value", death)
      .text(death)
      .classed("option-list-item",true);
  });

  // Initialize the dashboard to start at Unsafe Water Source
  optionChanged(causeDeath[0]);
  
  
  // Creating the map object
  var myMap = L.map("map1", {
    center: [32.7502, 45.7655],
    zoom: 2
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

var promises = [d3.json('Resources/countries.geojson'), d3.csv('Resources/merge_df.csv')]
var test = true;
function optionChanged(causeDeath) {
  Promise.all(promises).then(values => {
    var geoJson = values[0];
    var csv = values[1];
    geoJson.features.forEach(geoJsonDataPoint => {
        var countryCode = geoJsonDataPoint.properties.ISO_A3;
        var countryData = csv.filter(x => x.code === countryCode)
        if (countryData[0]) {
            Object.entries(countryData[0]).forEach((d) => {
                geoJsonDataPoint.properties[d[0]] = d[1];
            })
        }
    })
    console.log(geoJson);

    var water_source = {"country_code": values.features.properties.code, "death_perc": values.features.properties.unsafe_water_perct};
    var sanitation = {"country_code": values.features.properties.code, "death_perc": values.features.properties.unsafe_sanitation_perct};
    var handwash = {"country_code": values.features.properties.code, "death_perc": values.features.properties.no_handwashing_perct};

    // Create a new choropleth layer.
    geojson = L.choropleth(values, {

    // Define which property in the features to use. Needs to be variable based on dropdown selection
    valueProperty: "safe_water_2017",

    // Set the color scale.
    scale: ["#ffffb2", "#b10026"],

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
        "$" + feature.properties.safe_water_2017);
    }
  }).addTo(myMap);

  // Set up the legend.
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add the minimum and maximum.
    var legendInfo = "<h1>Median Income</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);



})}


