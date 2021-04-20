// //define data from datatable
// d3.csv("..Resources/merge_df.csv").then(function(data){
//   console.log(data);
//   var water_source = {"country_code": data.code, "death_perc": data.unsafe_water_perct};
//   var sanitation = {"country_code": data.code, "death_perc": data.unsafe_sanitation_perct};
//   var handwash = {"country_code": data.code, "death_perc": data.no_handwashing_perct};
// })
// //select map elements
// var map1 = d3.select("map1")
// var map2 = d3.select("map2")

// //define filter table button and entering
// var button = d3.select("button")
// var enter = d3.select(".form-control")

// //create function to filter list by input
// function changeGraphic() {
//   var inputElement = d3.select(".form-control")
//   var inputValue = inputElement.property("value")
  
//   //select table and body elements
//   var table = d3.select(".table")
//   var tbody = d3.select("tbody")
  
//   //clear table body
//   map2.text("")
  
//   //filter data for date entered
//   filteredData = data.filter(d => d.deathtype === inputValue)
//   //populate table with filtered list data
//   filteredData.forEach(function(UFOsiting) {
    
//       // Prevent the page from refreshing
//     var row = tbody.append("tr")
//     Object.entries(UFOsiting).forEach(function([key, value]) {
//         var dataElement = row.append("td")
//         dataElement.text(value)
//       });
//     });
// }

// //create handles
// button.on("click", filterList)
// enter.on("change", filterList)