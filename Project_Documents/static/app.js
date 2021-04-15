//define data from datatable
var tableData = data

//select table and body elements
var table = d3.select(".table")
var tbody = d3.select("tbody")

//print each data element
data.forEach(function(UFOsiting) {
    var row = tbody.append("tr")
    Object.entries(UFOsiting).forEach(function([key, value]) {
        var dataElement = row.append("td")
        dataElement.text(value)
      });
    });

//define filter table button and entering
var button = d3.select("button")
var enter = d3.select(".form-control")

//create function to filter list by input
function filterList() {
  var inputElement = d3.select(".form-control")
  var inputValue = inputElement.property("value")
  
  //select table and body elements
  var table = d3.select(".table")
  var tbody = d3.select("tbody")
  
  //clear table body
  tbody.text("")
  
  //filter data for date entered
  filteredData = data.filter(d => d.datetime === inputValue)
  //populate table with filtered list data
  filteredData.forEach(function(UFOsiting) {
    
      // Prevent the page from refreshing
    var row = tbody.append("tr")
    Object.entries(UFOsiting).forEach(function([key, value]) {
        var dataElement = row.append("td")
        dataElement.text(value)
      });
    });
}

//create handles
button.on("click", filterList)
enter.on("change", filterList)