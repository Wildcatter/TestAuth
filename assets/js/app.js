// Initialize Firebase
var config = {
    apiKey: "AIzaSyDaPvYALiV1qQwyDxIrIfkwCUerTu_uSiA",
    authDomain: "firstproject-b5d04.firebaseapp.com",
    databaseURL: "https://firstproject-b5d04.firebaseio.com",
    storageBucket: "firstproject-b5d04.appspot.com",
    };
 firebase.initializeApp(config);


// Establish easy access to db object
var db = firebase.database();

// For testing purposes, for testing of modal that pops up if user tries to 'Add Favorite', but they are not logged in
var userLoggedIn = false;

// For testing purposes, to obtain user informtion as if user were logged in
var userId = "757827487";

// Object for storing event properties and methods specific to any event actions, searching, etc
var eventObj = {

	// Set delay interval for ajaxCall(), so the spinner is visible for a minimum period of time (otherwise will go away too fast)
	timeDelay: 530,

	// Set query url as global so that ajaxCall() method may access it without receiving url as parameter 
	// (setTimeout does not allow for passing parameters to fn's)
	queryUrl: "",

	/**
	 * Build the query url string, and execute ajaxCall(), based on dataObj params. 
	 * Separated out from main ajaxCall() function, to properly execute processing spinner
	 * @param {object} dataObj Object containing search params
	 * @return N/A
	 */
	executeQueryUrl: function(dataObj) {
		// Set variables from dataObj items
  	    var city 	        = dataObj.city;
  	    var categoryId      = dataObj.categoryId;
  	    var queryStartDate  = dataObj.queryStartDate;
  	    var queryEndDate    = dataObj.queryEndDate;
	  
  	    // Build url query
  	    eventObj.queryUrl = "https://www.eventbriteapi.com/v3/events/search/?token=IVKXSGGHO6MZSHMF5QZZ&location.address=" + city + "&categories=" + categoryId + "&start_date.range_start=" + queryStartDate + "&start_date.range_end=" + queryEndDate + "&location.within=10mi";
	  
	  	// Load the spinner to indicate processing
		$('div.spinner-div').html('<div class="spinner">Loading...</div>');

		// Run the ajaxCall() method, after timeDelay interval. The spinner is removed once the ajax call is complete.
		setTimeout(eventObj.ajaxCall, eventObj.timeDelay);
	},

	/**
	 * Format the dates to send to the api query, and for updating the main page header
	 * Put in separate function so that it may be used for in several different query form submit scenarios
	 * Note: used for the following scenarios: 
	 * @param
	 * @return
	 */
	formatQueryDates: function(firstDate, lastDate) {
		// Set default date ranges if firstDate == null. Start date == today, end date == 6 months from now
		// Otherwise, set dates based on user input
		// Note: Eventbrite requires date to be in datetime format: "2010-01-31T13:00:00".
        // Default moment.format() function returns "MMMM-DD-YYT00:00:00-00:00". Cut of extra content so that api query works
        // Do not apply moment formatting to the date if the date has not been entered.  moment will return an error if so
        // Note: revisit the possibility of setting localStorage vars for start and end dates, so that category click will return dates from search?
        if(firstDate == null) {
        	firstDate   = new Date();
        	lastDate = moment(firstDate).add(6, 'months');
        } else {
        	firstDate = new Date(firstDate);
        	lastDate = new Date(lastDate);
        }

		var queryStartDate = moment(firstDate).format().slice(0, -6);
		var startDate      = moment(firstDate).format('MM/DD/YYYY');
		var queryEndDate   = moment(lastDate).format().slice(0, -6);
		var endDate        = moment(lastDate).format('MM/DD/YYYY');
		console.log("startDate: " + startDate + " queryStartDate: " + queryStartDate + " endDate: " + endDate + " queryEndDate: " + queryEndDate);
		
		// Return an object containing all correctly formatted date references
		return {
			queryStartDate: queryStartDate,
			startDate: startDate,
			queryEndDate: queryEndDate,
			endDate: endDate
		}
	},

    /**
     * Run the ajax call to the Eventbrite api
     * @param N/A
     * @return N/A
     * Note: this method is executed inside of executeQueryUrl() method
     */
  	ajaxCall: function() {
  	    $.ajax({
  	     url: eventObj.queryUrl,
  	     //url: "https://www.eventbriteapi.com/v3/events/search/?token=IVKXSGGHO6MZSHMF5QZZ&location.address=Austin&categories=103&start_date.range_start=2016-09-22T00:00:00&start_date.range_end=2016-10-25T00:00:00&location.within=10mi",
  	      method: "GET",
  	    }).done(function(response) {
  	    	console.log("typeof response: " + typeof response);
  	    	if(response != undefined) {
  	    		console.log("entered response != '' block");

  	    		// Remove the spinner
  	    		eventObj.removeSpinner();

  	        	// Empty out existing event content
  	        	$('.event-boxes').empty();
	    	
  	        	console.log("Response: " + response.events[1]);
	    	
  	        	// Save the response object as a session variable
  	        	localStorage.setItem("homePage-results", JSON.stringify(response));
	    	
  	        	//console.log("localStorage 'search-results': " + JSON.stringify(response));
  	
  	        	// Now generate the new content, and append it to the main section, replacing existing content
  	        	eventObj.generateSearchContent(response);
  					
  	        } else {
  	        	// This else block doesn't work. Never executes.  Can't figure out how to check for undefined, bc it is always logging as an object
  	        	console.log("entered response false block");
  	        	$('.event-boxes').html('<h3 style="color: #FEDC32;"> Sorry, but there were no events found for your search! </h3>');
  	        }
	    
  	        // Redirect to dashboard page, now that search results have been returned
  	        //window.location="file:///Users/Yo/Desktop/Bootcamp/homework/group-projects/Group-Event-Project1/dashboard.html";
  	    });
  	}, // ajaxCall()

  	/**
  	 * Remove the spinner when the ajax call returns a response
  	 * Item removed inside of div.spinner-div is actually <div class="spinner"></div>
  	 * Put this in a function for ease of readability, and for reuse in case name or structure of spinner operation changes
  	 * @param N/A
  	 * @return N/A
  	 */
  	removeSpinner: function() {
  		$('div.spinner-div').empty();
  	},

  	/**
	 * Create the search event box content cards from an event response data object
	 * This is used by ajaxCall(), as well as the default dashboard page load from the localStorage "response" item
	 * @param {object} response Data containing all of the event search results
	 * @return N/A
	 */
	generateSearchContent: function(response) {
		// Loop through each event item from the event search response object
		response.events.forEach(function(item, index, arr) {

			// Set easy access to name
			var name = item.name.text;

			// Set easy access to date. Format it using moment.js plugin
			var date = moment(item.start.local).format('MMMM Do YYYY');

			// Set easy access to event description
			var desc = item.description.text;
			var shorDesc = "";
			var fullDesc = "";

			// If there is no item description, set default message. Save long description for modal dropdown
			if (item.description.text != null) {
				longDesc  = desc;
				shortDesc = desc.slice(0, 100) + "...";
			} else {
				longDesc = shortDesc = "No description available.";
			}

			// Build string of html content, filling in variable content with response items. fullDesc will be used for modal dropdown of full description
			let html = '<div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 event-box">' +
                      '<div class="panel event-content text-center card-image" id="event' + index + '">' +
                          '<h3 class="event-name" data-name="' + name + '">' + name + '</h3>' +
                          '<p class="event-date" data-date="' + date + '">' + date + '</p>' +
                          '<p class="event-desc" data-desc="' + longDesc + '">' + shortDesc + '</p>' +
                      '</div>' +
                      '<button type="button" class="btn btn-lg btn-block fav-button show">add favorite</button>' +
                      '<div class="card-reveal">' +
                           '<span class="card-title">Card Title</span><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>' +
                           '<p>Here is some more information about this product that is only revealed once clicked on.</p>' +
                      '</div>' +
                  '</div>';

		     // Append new event block to div.main
		     $(".event-boxes").append(html);
		});
	}, // generateSearchContent()

    /**
     * Process search field inputs - prepare them for ajax call
     * @param
     * @return {object} dataObj Contains all form input data
     */
    getSearchInputData: function() {
        // Get form inputs. Trim whitespace
        var city         = $('#search-city').val().trim();
        var categoryId   = $('#search-category').val().trim();
        var categoryName = $('#search-category option:selected').data("category");
        var firstDate    = $('#search-date-start').val().trim();
        var lastDate     = $('#search-date-end').val().trim();
        console.log("city: " + city + " categoryId: " + categoryId + " categoryName: " + categoryName + " date1: " + firstDate + " date2: " + lastDate);
  		
  		// Prevent form submit if all inputs are empty
        if(city == "" && categoryId == "" && firstDate == "" && lastDate == "") {
        	// Close the search modal, and then show the alert modal
        	$('.searchModal').modal("hide");
            contentObj.showAlertModal("You didn't enter any search criteria!");
            return false;
        }
  
        // Prevent form submit if there was no city entered.  This is the minimum search requirement
        if(city == "") {
        	// Close the search modal, and then show the alert modal
        	$('.searchModal').modal("hide");
            contentObj.showAlertModal("You must at least enter a city for your search!");
            return false;
        }

  		// Set city location to session var. Note: this is also set in other places. You want to overrite it every time a new search occurs
  		localStorage.setItem("city-location", city);

  		// All inputs are good to go; now format dates for query string and search feedback msg string
  		var dateObj = eventObj.formatQueryDates(firstDate, lastDate);     
        
        // Send search inputs to ajaxCall. Note: ajaxCall will set response data as localStorage item for dashboard.html content generation
        var dataObj = {
            city: city,
            categoryId: 	categoryId,
            categoryName: 	categoryName,
            startDate: 		dateObj.startDate,
            queryStartDate: dateObj.queryStartDate,
            endDate: 		dateObj.endDate,
            queryEndDate: 	dateObj.queryEndDate
        }
  
        return dataObj;
    },

    /**
     * Set search results feedback heading based on searched items
     * @param {object} dataObj All search parameters
     * @return N/A
     */
    getFeedbackMsg: function(dataObj) {
      
        // First, build beginning default string.  
        var msg = '';
    
        // If user entered a category, add that as well
        if(dataObj.categoryName != null) {
            msg += dataObj.categoryName;
        }
    
        // City will ALWAYS be required
        msg += ' events in ' + dataObj.city;
    
        // If date range was entered, add that as well. First, format it back 
        msg += ' ' + dataObj.startDate + ' - ' + dataObj.endDate;
    
        // Set search feedback as localStorage item
        localStorage.setItem("search-feedback", msg);

        // Update main heading with search feedback
  		$('.header-span').text(msg);
    }

} // eventObj

var contentObj = {
	/**
	 * Show modal for any system alerts
	 * @param {string} msg The alert message to display
	 * @return N/A
	 */
	showAlertModal: function(msg) {
		// Replace content with param
		$('.alertModal p#modal-alert-msg').text(msg);

		// Show the modal
		$('.alertModal').modal("show");
	}
}

$(document).ready(function() {

	// Include the datepicker, from jQuery UI library
  	$("#search-date-start").datepicker();
  	$("#search-date-end").datepicker();

  	// Slide Reveal function for favorites side content
    $("#slider").slideReveal({
        trigger: $("#trigger"),
        push: false,
        overlay: true,
        position: "right",
        speed: 600
    });

    // Card slider for my favorites options
    var slider;

    $('.event-boxes').on('click','.show', function(){
        console.log(this);
        console.log("I clicked");
        var slider = $(this);
        slider.siblings('.card-reveal').slideToggle('slow');
    });
    
    $('.event-boxes').on('click','.close', function(){
        $(this).parent().slideToggle('slow');
    });

	// Get the events on initial page load, if the user used the search form on the main homepage (comes from localStorage var)
	// If user chose to login instead, do not show any events, but show a welcome message
	if(localStorage.getItem("homePage-results") != "") {
		var response = JSON.parse(localStorage.getItem("homePage-results"));
		eventObj.generateSearchContent(response);

		// Now insert the feedback search results into the main heading
		$('.header-span').text(localStorage.getItem("search-feedback"));

		console.log("The page should have loaded the homepage search results!");
	} else {
		$(".event-boxes").append("<h3> Hello, [username]!  What are you looking for today? </h3>");
	}

	// If the user clicks on an event box, show modal with event info (giving greater detail of description etc)
	// Had to start with div.main parent, then narrow down, due to DOM being updated dynamically with events after initial page load
	$('.event-boxes').on('click', 'div.event-content', function() {
		console.log("this: " + this);

		// Get the parent element for reference
		var parentId = "#" + $(this).attr("id");
		console.log("parentId: " + parentId);

		// Fill in the div.eventModal elements with updated content
		var data;

		// Get event name
		data = $(parentId + ' h3').data("name");
		$('#modal-event-name').text(data);

		// Get event date
		data = $(parentId + ' p.event-date').data("date");
		$('#modal-event-date').text(data);

		// Get event description
		data = $(parentId + ' p.event-desc').data("desc");
		$('#modal-event-desc').text(data);

		// Now show the modal
		$('.eventModal').modal("show");
	});

	// On click function to display only the events within that specific category
	// Note: user's location will be based on session var, which is based on either A) auto location at login, or B) via event search form
	$('.click-option').on('click', function(){
		// Set city based on location session var
		if(localStorage.getItem("city-location") != null) {
			var city = localStorage.getItem("city-location");
		} else {
			// Note: just as a fail-safe, set a default city.  YOU DON"T want to ever actually have to use this, dude!!
			var city = "Austin";
		}

		// Assign the data from the button to eventInfo
		var categoryId = $(this).data("id");
		console.log("categoryId: " + categoryId);

		// Get the category name
		var categoryName = $(this).data("category");
		console.log("categoryName: " + categoryName);

		// Set and format default date range for query search and search feedback heading string. Function will return object with date properties
		var firstDate = null;
		var lastDate  = null;
		var dateObj   = eventObj.formatQueryDates(firstDate, lastDate);		
		
        // Run Ajax function
        var dataObj = {
            city: 			city,
            categoryId: 	categoryId,
            categoryName: 	categoryName,
            startDate: 		dateObj.startDate,
            queryStartDate: dateObj.queryStartDate,
            endDate: 		dateObj.endDate,
            queryEndDate: 	dateObj.queryEndDate
        }

        eventObj.executeQueryUrl(dataObj);

        // Update the search feedback main heading
        eventObj.getFeedbackMsg(dataObj);
	});

	// Process search modal submit
    $('#modal-search-submit').on('click', function() {
        // Get form input data and process so it is ready to send to the api ajax call
        var dataObj = eventObj.getSearchInputData();

        // Check for false return from getSearchInputData(), to prevent spinner from executing
        if(!dataObj) {
          return false;
        }

        // Execute the ajax call, and save response to localStorage
        eventObj.executeQueryUrl(dataObj);

        // Set the search feedback message, and save to localStorage
        eventObj.getFeedbackMsg(dataObj);

    });

	// If user clicks 'Add Favorite' button, show alert modal if user is not logged in yet
	$('.fav-button').on('click', function(){
		if(!userLoggedIn) {
			contentObj.showAlertModal("You must be logged in to save favorites!");
		}
	});

	// If user clicks "Find Events" button, show event search modal
	$('button#find-events-btn').on('click', function() {
		$('.searchModal').modal("show");
	});

	// If user enters new city into location input, set localStorage item to that city
	// To-do:  Do we want to make it so that this action also populates 'all events' in that location by default?? Sure!!
	$('.location-icon').on('click', function() {
		// Get the text in the input
		var city = $('.location-input').val().trim();

		// Set city to local storage
		localStorage.setItem("city-location", city);
		console.log("localStorage city: " + city);

		// Set categoryId == "", as default load for change location action == all categories
		var categoryId = "";

		// Set categoryName == "all events" for change location main heading feedback
		var categoryName = "all events";

		// Show fadeIn/fadeOut feedback to user for successful location set
		$('p.location-input-feedback').text(city + " location Set Successfully!").fadeIn(1000).fadeOut(2000);

		// Empty out the text that user just submitted
		$('.location-input').val("");

		// Set and format default date range for query search and search feedback heading string. Function will return object with date properties
		// Note: might want to revisit the possibility of setting date range to == localStorage dates, instead of default, in some cases
		var firstDate = null;
		var lastDate  = null;
		var dateObj   = eventObj.formatQueryDates(firstDate, lastDate);	

		// Generate new result set, setting event categoryId to null & categoryName to "all events" to retrieve 'all events', and new city location as the location
		var dataObj = {
			city: city,
            categoryId: 	categoryId,
            categoryName: 	categoryName,
            startDate: 		dateObj.startDate,
            queryStartDate: dateObj.queryStartDate,
            endDate: 		dateObj.endDate,
            queryEndDate: 	dateObj.queryEndDate
		}
		// Execute the query
		eventObj.executeQueryUrl(dataObj);

		// Generate feedback message
		eventObj.getFeedbackMsg(dataObj);
	});

	// Also allow user to submit city location input via keyboard enter key
	$('.location-input').keypress(function(e) {
		if(e.which == 13) {
			// Run the click handler for location input action
			$('.location-icon').click();
		}
	});
});