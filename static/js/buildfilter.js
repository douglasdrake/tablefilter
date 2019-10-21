// Helper functions for string checking

/* Check if a string is empty, null or undefined */
function isEmpty(str) {
    return (!str || 0 === str.length);
}

/*  Check if a string is blank, null or undefined */
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

/* For checking if a string is blank or contains only white-space: */
String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};


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
/*
console.log("User input string is 'foo'");
let testFun = buildTestEqualString("foo");
console.log("Testing the empty string against 'foo': " + testFun(""));
console.log("Testing 'foo ' against 'foo': " + testFun("foo "));

console.log("User input string is empty");
let testFunBlank = buildTestEqualString("");
console.log("Testing 'foo' against the empty string: " + testFunBlank("foo"));
console.log('Testing null against the empty string: ' + testFunBlank(null));

let combinedFooBarTest = ((x, y) => (buildTestEqualString("foo")(x) && buildTestEqualString("bar")(y)));

console.log('Checking empty string against "foo" and undefined against "bar": ' + combinedFooBarTest(""));
console.log('Checking "foo" against "foo" and "bar" against "bar": ' + combinedFooBarTest("foo", "bar"));

let combinedNullFooTest = ((x,y) => (buildTestEqualString(null)(x) && buildTestEqualString("foo")(y)));
console.log(combinedNullFooTest("bar", "foo"));
*/

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

// console.log(buildTestFunction('foo'));

// console.log(buildTestFunction(['foo', 'bar']));
// let testFooOrBar = buildTestFunction(['foo', 'bar']);
// console.log(testFooOrBar('foo'));
// console.log(testFooOrBar('bar'));
// console.log(testFooOrBar('baz'));

/* There has to be a way to build a filter up from a variable number of arguments - 
 See below */

function oldBuildFilter(targetDate, targetCountry, targetState, targetCity, targetShape) {
    let dateFunction = buildTestFunction(targetDate);
    let countryFunction = buildTestFunction(targetCountry);
    let stateFunction = buildTestFunction(targetState);
    let cityFunction = buildTestFunction(targetCity);
    let shapeFunction = buildTestFunction(targetShape);

    return ((date, country, state, city, shape) => (
        dateFunction(date) && 
        countryFunction(country) &&
        stateFunction(state) &&
        cityFunction(city) &&
        shapeFunction(shape)));
}

// console.log(oldBuildFilter('1/1/2010', 'us', 'ca', 'fresno', 'light'));

// null, undefined, and an empty string represent unspecified menu options:
// let aFilter = oldBuildFilter('1/1/2010', null, undefined, '', 'round');
// console.log(aFilter('1/1/2010', 'us', 'ca', 'fresno', 'round'));

// let anotherFilter = oldBuildFilter(['1/1/2010', '1/20/2010'], '', '', '', '');
// console.log(anotherFilter('1/1/2010', 'us', 'ca', 'fresno', 'light'));

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

let aNewFilter = buildFilter('', ['ca', 'us'], '1/1/2010');

let aTestArray = ['something', 'ca', '1/1/2010'];
console.log(aNewFilter);
console.log(aTestArray);
console.log(applyFilter(aNewFilter, aTestArray));
