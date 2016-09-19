// Firebase database config info
var config = {
    apiKey: "AIzaSyDaPvYALiV1qQwyDxIrIfkwCUerTu_uSiA",
    authDomain: "firstproject-b5d04.firebaseapp.com",
    databaseURL: "https://firstproject-b5d04.firebaseio.com",
    storageBucket: "firstproject-b5d04.appspot.com",
 };

// Initialize Firebase for use in app
firebase.initializeApp(config);
var database = firebase.database();
const auth = firebase.auth();

// testing Sarah's object for each category id
var testSarahsObject = {};

// Object for storing event properties and methods specific to any event actions
var eventObj = {

	/**
	 * Run the ajax call to the Eventbrite api
	 * @param {object} dataObj Contains parameters as an object
	 * @return N/A
	 */
	ajaxCall: function(dataObj) {

        var city = dataObj.city;
        var categoryId = dataObj.categoryId;
		var url = "https://www.eventbriteapi.com/v3/events/search/?token=IVKXSGGHO6MZSHMF5QZZ&location.address=" + city + "&categories=" + categoryId + "&location.within=10mi";

		$.ajax({
			url: url,
			method: "GET",
		}).done(function(response) {

			console.log("Response: " + response.events[1]);

            // clear the main content container
            $(".event-boxes").empty();

			// Loop through each event item
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
		                  		'<div class="panel event-content text-center" id="event' + index + '">' +
		                    		'<h3 class="event-name" data-name="' + name + '">' + name + '</h3>' +
		                    		'<p class="event-date" data-date="' + date + '">' + date + '</p>' +
		                    		'<p class="event-desc" data-desc="' + longDesc + '">' + shortDesc + '</p>' +
		                  		'</div>' +
		                  		'<button type="button" class="btn btn-lg btn-block fav-button">add favorite</button>' +
		        		    '</div>';

		        // Append new event block to div.main
		        $(".event-boxes").append(html);
			});
		});
	}
}

$(document).ready(function() {

    // // Slide Reveal function
    // $("#slider").slideReveal({
    //     trigger: $("#trigger"),
    //     push: false,
    //     overlay: true,
    //     position: "right"
    // });

	// Get the events on initial page load (50 of the first "All" events from the api)
    var dataObj = {
        city: "Austin",
        categoryId: 103
    }
	eventObj.ajaxCall(dataObj);

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

	// Clickable event categories to narrow user search (Sarah 09/14)
	// On click function to display only the events within that specific category
	$('.click-option').on('click', function(){

		// Assign the data from the button to eventInfo
		var catId = $(this).data("id");
		// Testing that we're getting the id back when clicking
		console.log(catId);
        // Run Ajax function after user clicks category
        var dataObj = {
            city: "Austin",
            categoryId: catId
        }
        eventObj.ajaxCall(dataObj);
	});

});
// q = events with keyword
// start_date.range_start
// start_date.range_end
//location.address
// location.within
// categories
//response.events[i].description.text
//response.events[i].end.local
// "".name.text
// "" start.local
// ""