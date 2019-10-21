// Douglas Drake
// from data.js

/* Updated June 12, 2019: The filter function is built based on user input and can accept single, multiple or missing entries */

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

// Select the submit button
var submit = d3.select("#filter-btn");

console.log(submit);

submit.on("click", function() {
  d3.event.preventDefault();

  // Select the input element and get the raw HTML node
  var dateElement = d3.select("#datetime");
  var shapeElement = d3.select("#shape");
  var stateElement = d3.select("#state");
  var countryElement = d3.select("#country");
  var cityElement = d3.select("#city");

  // Get the value property of the input element
  var inputDate = transformInputs(dateElement.property("value"));
  var inputShape = transformInputs(shapeElement.property("value").toLowerCase());
  var inputState = transformInputs(stateElement.property("value").toLowerCase());
  var inputCountry = transformInputs(countryElement.property("value").toLowerCase());
  var inputCity = transformInputs(cityElement.property("value").toLowerCase());

  console.log("Inputshape " + inputShape);

  var userFilter = buildFilter(inputDate, inputCountry, inputState, inputCity, inputShape);

  if(inputShape) {
    console.log('Input shape was given');
  }
  /* Blank fields are ignored */

  var filteredData = tableData.filter(function(sighting) {

    let filterArgs = [sighting.datetime,
                      sighting.country,
                      sighting.state,
                      sighting.city,
                      sighting.shape];
    return applyFilter(userFilter, filterArgs)
  });

  // pick the table for the filtered results
  var fbody = d3.select("#filter-table");
  fbody.html("");

  /* var ftitle = d3.select("#filter-state");
  ftitle.html("");
  ftitle.append("The filter settings: "); */

  // write to the table
  filteredData.forEach((datum) => {
    var row = fbody.append("tr");
    Object.entries(datum).forEach(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
    });
  });

  console.log(filteredData);

});

/* Check if a string is empty, null or undefined */
function isEmpty(str) {
  return (!str || 0 === str.length);
}

/*  Check if a string is blank, null or undefined */
function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

/* Take a user input string `inputStr` and return a predicate function that tests for equality
against `inputStr` or always returns true if the inputStr is null, undefined, or empty.  
This function is used to build up a filter and the user input string being null, empty or 
undefined is implied not to filter on a particular criteria - so always return true to not limit
results */
function buildTestEqualString (inputStr) {
  /* If inputStr is null, undefined, or empty the test function should return true */
  if (isBlank(inputStr) || isEmpty(inputStr)) {
      return ((x) => true);
  } else {
      return( (x) => (x === inputStr))
  }
}

/* If `args` is a single string return the predicate function from above or if `args`
is a list of strings, use the Array.includes() method to return a predicate
function that will test if an argument is in the array of args */
function buildTestFunction(args) {
  if (Array.isArray(args)) {
      return ((x) => args.includes(x));
  } else { 
      return buildTestEqualString(args);
  } 
}

function buildFilter(...args) {
  /* This builds a list of predicate functions */
  let functionList = [];
  for (let arg of args) {
      functionList.push(buildTestFunction(arg));
  }
  return functionList;
}

// a function to zip an array of arrays -
// similar to zip in Python
// this code from stack exchange
function zip(arrays) {
  return arrays[0].map(function(_,i){
      return arrays.map(function(array){return array[i]})
  });
}

function applyFilter(functions, arguments) {
  // create an array of pairs [function, argument]
  let functionsAndArgs = zip([functions, arguments]);

  let result = [];
  for (let pair of functionsAndArgs) {
      result.push(pair[0](pair[1]));
  }

  // now apply && to all elements - return true if all true
  // otherwise return false
  // there should be a way to short circuit this and return on the first false
  return result.reduce((x, y) => (x && y))
}

/* allow for a comma separated strings for multiple inputs */
function transformInputs(userinput) {
  if (Array.isArray(userinput)) {
      return userinput.map( (x) => (x.trim().toLowerCase()) );
  } else if (!userinput) {
      return userinput
  } else {
      let userInputs = userinput.split(',');

      if (userInputs.length === 1) {
          return userInputs[0].trim().toLowerCase()
      } else {
          return userInputs.map( (x) => (x.trim().toLowerCase()))
      }
  }
}
