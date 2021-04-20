// Creating the map object
var myMap2 = L.map("map2", {
    center: [32.7502, 45.7655],
    zoom: 2
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap2);
  
  var promises = [d3.json('Resources/countries.geojson'), d3.csv('Resources/merge_df.csv')]
  var test = true;
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

      // Create a new choropleth layer.
      geojson = L.choropleth(values, {
  
      // Define which property in the features to use.
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
  
      // Binding a popup to each layer
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Country: " + feature.properties.country_name + "<br>% of Population with Access to Clean Water:<br>" +
          "$" + feature.properties.safe_water_2017);
      }
    }).addTo(myMap2);
  
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
    legend.addTo(myMap2);
  
  
  
  })
  
  
  