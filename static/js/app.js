// from data.js
var tableData = data;

var tbody = d3.select("#all-reports");

// Populate the table with the sightings
data.forEach((tableData) => {
    var row = tbody.append("tr");
    Object.entries(tableData).forEach(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
    });
  });

// console.log("Made it to this point");

// Select the submit button
var submit = d3.select("#filter-btn");

console.log(submit);

submit.on("click", function() {
  d3.event.preventDefault();

  // console.log("A click");

  // Select the input element and get the raw HTML node
  var dateElement = d3.select("#datetime");
  var shapeElement = d3.select("#shape");
  var stateElement = d3.select("#state");
  var countryElement = d3.select("#country");
  var cityElement = d3.select("#city");

  // Get the value property of the input element
  var inputDate = dateElement.property("value");
  var inputShape = shapeElement.property("value").toLowerCase();
  var inputState = stateElement.property("value").toLowerCase();
  var inputCountry = countryElement.property("value").toLowerCase();
  var inputCity = cityElement.property("value").toLowerCase();

  // console.log(inputShape);

  var filteredData = tableData.filter(function(sighting) {
    return sighting.shape === inputShape &&
           sighting.datetime === inputDate &&
           sighting.state === inputState &&
           sighting.country === inputCountry && 
           sighting.city === inputCity
  });

  // pick the table for the filtered results
  var fbody = d3.select("#filter-table");
  fbody.html("");

  // write to the table
  filteredData.forEach((datum) => {
    var row = fbody.append("tr");
    Object.entries(datum).forEach(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
    });
  });

  console.log(filteredData);

  // Then, select the unordered list element by class name
  var list = d3.select(".summary");

  // remove any children from the list to
  list.html("");



});
