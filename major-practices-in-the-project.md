# Major Practices Used In The Project

In this article i'll highlight the practices and patterns i've learned through developing.

## 1- Modular Javascript

**Modular programming** is a software design technique that emphasizes separating the functionality of a *program* into independent, interchangeable modules, such that each contains everything necessary to execute only one aspect of the desired functionality.

But how to achieve that with Javascript (ES5) ?

A: Using the (Immediately Inovked Function Expression ) IIFE and Closures, that returns an Object in which we expose our Public Elements.

Example: Implementing a simple 3-Tier Architecture using modular javscript.

```javascript
// DataLayer
// Mainly Responsible for handling CRUD Operations and Communicate with the DB
var DataLayer = (function () {
    // Here goes the private elements that's necessary for internal operations.

    return {
       // Here goes the public elements, that you'd like to expose.
       AddItem: function (obj) {

       },
       DeleteItem: function (id) {

       },
    };
})();

// Presentation Layer
// Mainly for Manipulating and Keep tracking the DOM Objects
var PresentationLayer = (function () {
    // Here goes the private elements that's necessary for internal operations.   

    return {
        // Here goes the public elements, that you'd like to expose.
        getInput: function () {

        },
        addListItem: function (item, type) {

        },
        deleteListItem: function (itemId) {

        },
        clearFields: function () {

        },
    };
})();

// Controller: arguments are used to control these modules
// Mainly for handling events
var controller = (function (dataLayer, presentationLayer) {
    // Here goes the private elements that's necessary for internal operations.

    return {
    // Here goes the public elements, that you'd like to expose.
        init: function () {
            console.log("Application Has Started...");
        }
    };

})(DataLayer, PresentationLayer);
```

## 

## Controller Module Essentials

### 1-` Init()` Function

Init() functions is the Initial Point (<mark>Trigger</mark>)  for the whole app, in which we invoke the sub-principle parts to run such as **`SetupEventListeners`** function.

### 2-  `SetupEventListeners()` Function

In this one we tend to assign EventHandlers to the main controls on our page. for example, start button, add button, remove button, ... etc

### Notes :

- Controller Module is tend to accumulate, Interlap and mix functions from different modules and sources to achieve a specific task. 

- Controller in general is responsible for handling requests, whether it's an event or a regular http request.

## Presentation Module Essentials

### 1- `DOMStrings` property

We tend to store the Id's and ClassName's for elements of  interest in this property for two reasons: 

- Easily manipulate the dom elements.

- Easily maintain the names later if we ever decided to change them.
  
  Example:
  
  ```javascript
  var DOM = {
  
          ClassNames: {
              StartBtn: '.counter--start',
              PauseBtn: '.counter--pause',
              StopBtn: '.counter--stop',
              // Clock Placeholder
              HoursePlc: '.counetr__block--hour',
              MinutesPlc: '.counetr__block--minute',
              SecondsPlc: '.counetr__block--second',
              // History
              HistoryContainer: '.history__items',
              HistoryClear: '.history__header--clear',
              HistItem: '.history__item',
              HistNoteContent: '.history__note--content',
              HistItemRemove: '.history__note--remove',
              HistItemEdit: '.history__note--edit'
          },
          IdNames: {
  
          }
      };
  ```

## Data Module Essentials

Data Module will essentially hold the following parts:

1. **CRUD** Related Operations Functions and Properties.

2. Models/Entities to represent various objects on the page.

## Service Module (Additional)

We Often use this layer specially to handle the following:

- Contain Dto's (Data Transfere Objects).

- Contain Query Objects.

## Tips & Tricks

### 1- Converting the `NodeList` obj to an array

We often convert the `NodeList` returned by the `document.querySelectorAll()` to an Array to iterate over it using array's foreach method. 

Code: `elemArr = Array.prototype.slice.call(NodeListElem);`

You might ask why? we already can iterate over the NodeList, but i found this answer convinced me 

> Those arrays need to remain valid even if the elements there in are subsequently removed from the DOM. The references in the array are still valid, and can be used to reinsert those elements back into the DOM.  
> 
> If all you had was a live NodeList the elements would automagically disappear from the list when they're removed from the DOM, and would be lost forever unless you had a separate reference to them.
> 
> Source: [javascript - Why do Array.prototype.slice.call(nodeList) for DOM elements? - Stack Overflow](https://stackoverflow.com/questions/13295361/why-do-array-prototype-slice-callnodelist-for-dom-elements)

Example:

```javascript
fields = document.querySelectorAll(DOMStrings.inputValue + ',' + DOMStrings.inputDescription);

fieldsArr = Array.prototype.slice.call(fields);

fieldsArr.forEach(function (current) {
     current.value = "";
});
```

### 2- Create a NodeList Foreach Function

As mentioned previously, we can already loop over the NodeList elements and here is how: 

```javascript
var NodeListForeach = function(fields, callback) {
    for (var i = 0; i < fields.length; i++) {
        callback(fields[i], i, fields);
    }
};

var fields = document.querySelectorAll(DOM.ClassNames.HistItem);

NodeListForeach(fields, function (current, index) {
   // Do something on each element ...              
});
```

It's a bit confusing, when should we use the first method and when should use the second one?

### 3- Event Delegation or Event Propagation

By default, events bubble in JavaScript. Event bubbling is when an event will traverse from the most inner nested HTML element and move up the DOM hierarchy until it arrives at the element which listens for the event. This move is also popularly known as **Event Propagation** or **Event Delegation**.

**The Bubbling principle:** When an event happens on an element, it first runs the handlers on it, then on its parent, then all the way up on other ancestors.

For Further Details:

1. [Javascript - Event order](https://www.quirksmode.org/js/events_order.html) [Recommended]

2. [Event Bubbling in JavaScript: Handing JavaScript events efficiently with bubble and capture - DEV](https://dev.to/shimphillip/handing-javascript-events-efficiently-with-bubble-and-capture-4ha5)
