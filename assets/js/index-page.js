// Initialize Firebase
var config = {
  apiKey: "AIzaSyA9gw81RM2br5S9X55E0G6ZGjJMo1oDVRs",
  authDomain: "eventi-testing-db.firebaseapp.com",
  databaseURL: "https://eventi-testing-db.firebaseio.com",
  storageBucket: "eventi-testing-db.appspot.com",
  messagingSenderId: "393804341426"
};
firebase.initializeApp(config);

// Establish easy access to db object
var db = firebase.database();

// Object for storing event properties and methods specific to any event actions
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
        var city            = dataObj.city;
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
            startDate:      startDate,
            queryEndDate:   queryEndDate,
            endDate:        endDate
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
          
                //console.log("Response: " + response.events[1]);
                // Save the response object as a session variable
                localStorage.setItem("homePage-results", JSON.stringify(response));
                //console.log("localStorage 'search-results': " + JSON.stringify(response));
      
                // Now generate the new content, and append it to the main section, replacing existing content
                // Note: this is not necessary on the home page
                //eventObj.generateSearchContent(response);
            
            } else {
                // This else block doesn't work. Never executes.  Can't figure out how to check for undefined, bc it is always logging as an object
                console.log("entered response false block");
                //$('.event-boxes').html('<h3 style="color: #FEDC32;"> Sorry, but there were no events found for your search! </h3>');
            }
      
            // Redirect to dashboard page, now that search results have been returned
            window.location="file:///Users/Yo/Desktop/Bootcamp/homework/group-projects/Group-Event-Project1/dashboard.html";
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
            contentObj.showAlertModal("You didn't enter any search criteria!");
            return false;
        }
  
        // Prevent form submit if there was no city entered.  This is the minimum search requirement
        if(city == "") {
            contentObj.showAlertModal("You must at least enter a city for your search!");
            return false;
        }

        // Set city location to session var. Note: this is also set in other places. You want to overrite it every time a new search occurs
        localStorage.setItem("city-location", city);
  
        // All inputs are good to go; now format dates for query string and search feedback msg string
        var dateObj = eventObj.formatQueryDates(firstDate, lastDate);     
        
        // Send search inputs to ajaxCall. Note: ajaxCall will set response data as localStorage item for dashboard.html content generation
        var dataObj = {
            city:           city,
            categoryId:     categoryId,
            categoryName:   categoryName,
            startDate:      dateObj.startDate,
            queryStartDate: dateObj.queryStartDate,
            endDate:        dateObj.endDate,
            queryEndDate:   dateObj.queryEndDate
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
        // Note: not necessary on main homepage
        //$('.header-span').text(msg);
    }

/******************************/
// orig code
  /**
   * Run the ajax call to the Eventbrite api
   * @param {object} dataObj Contains parameters as an object
   * @return N/A
   */
  /*
  ajaxCall: function(dataObj) {

    // Set variables from dataObj items
    var city = dataObj.city;
    var categoryId = dataObj.categoryId;
    var startDate = dataObj.queryStartDate;
    var endDate = dataObj.queryEndDate;

    // Build url query
    var url = "https://www.eventbriteapi.com/v3/events/search/?token=IVKXSGGHO6MZSHMF5QZZ&location.address=" + city + "&categories=" + categoryId + "&start_date.range_start=" + startDate + "&start_date.range_end=" + endDate + "&location.within=10mi";

    // Load the spinner to indicate processing
    $('div.spinner-div').html('<div class="spinner">Loading...</div>');

    $.ajax({
      url: url,
      method: "GET",
    }).done(function(response) {

      console.log("Response: " + response.events[1]);

      // Save the response object as a session variable, ONLY if user is not yet logged in. stringify for correct storage format
      localStorage.setItem("homePage-results", JSON.stringify(response));

      //console.log("localStorage 'search-results': " + JSON.stringify(response));

      // Redirect to dashboard page, now that search results have been returned
      window.location="file:///Users/Yo/Desktop/Bootcamp/homework/group-projects/Group-Event-Project1/dashboard.html";

    });
  }, // ajaxCall()

  /**
   * Process search field inputs - prepare them for ajax call
   * @param
   * @return {object} dataObj Contains all form input data
   */
  /*
  getSearchInputData: function() {
      // Get form inputs. Trim whitespace
      var city = $('#search-city').val().trim();
      var categoryId = $('#search-category').val().trim();
      var categoryName = $('#search-category option:selected').data("category");
      var startDate = $('#search-date-start').val().trim();
      var endDate = $('#search-date-end').val().trim();
      console.log("city: " + city + " categoryId: " + categoryId + " categoryName: " + categoryName + " date1: " + startDate + " date2: " + endDate);

      // Save city as localStorage session var so that the dashboard page will have a default location to load if user clicks categories
      // Note: while on the main dashboard page, the user also has the option to search again, which will reset the location session var,
      // or has the option to manually set their location via a form on the page, whic will also reset the location session var
      // Note: for what to do when user logs in from the main home page instead of searching, need to visit the option of setting their location somehow
      localStorage.setItem("city-location", city);

      // Convert dates to eventBrite api required format using moment.js library
      // Note: Eventbrite requires date to be in datetime format: "2010-01-31T13:00:00".
      // Default moment.format() function returns "MMMM-DD-YYT00:00:00-00:00". Cut of extra content so that api query works
      // Do not apply moment formatting to the date if the date has not been entered.  moment will return an error if so
      if(startDate != null) {
          var queryStartDate = moment(new Date(startDate)).format().slice(0, -6);
      }

      if(endDate != null) {
          var queryEndDate = moment(new Date(endDate)).format().slice(0, -6);
      }
      console.log("moment date1: " + queryStartDate + " moment date2: " + queryEndDate);

      // Prevent form submit it all inputs are empty
      if(city == "" && categoryId == "" && startDate == "" && endDate == "") {
          alert("You didn't enter any search criteria!");
          return false;
      }

      // Prevent form submit if there was no city entered.  This is the minimum search requirement
      if(city == "") {
          alert("You must at least enter a city for your search!");
      }
      
      // Send search inputs to ajaxCall. Note: ajaxCall will set response data as localStorage item for dashboard.html content generation
      var dataObj = {
          city: city,
          categoryId: categoryId,
          categoryName: categoryName,
          startDate: startDate,
          queryStartDate: queryStartDate,
          endDate: endDate,
          queryEndDate: queryEndDate
      }

      return dataObj;
  },

  /**
   * Set search results feedback heading based on searched items
   * @param {object} dataObj All search parameters
   * @return N/A
   */
  /*
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
  }*/
} // var eventObj

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

// Main document code
$(document).ready(function() {

	// Include the backstretch plugin to make the background images fully responsive and rotating
	$.backstretch(
		[
  	      "assets/img/chicago-new.jpg",
  	      "assets/img/flaming-lips.jpg",
  	      "assets/img/concert-image-02.jpg"
  		],
  		// Duration == pause time, fade == transition time
  		{
  			duration: 6000,
  			fade: 1400
  		}
  	);

  	// Include the datepicker, from jQuery UI library
  	$("#search-date-start").datepicker();
  	$("#search-date-end").datepicker();

    // Process search submit
    $('#search-submit').on('click', function() {
        // Get form input data and process so it is ready to send to the api ajax call
        var dataObj = eventObj.getSearchInputData();

        // Check for false return from getSearchInputData(), to prevent spinner from executing
        if(!dataObj) {
          return false;
        }

        // Set the search feedback message, and save to localStorage. Do so before page redirect, so that message is saved
        eventObj.getFeedbackMsg(dataObj);

        // Execute the ajax call, and save response to localStorage
        eventObj.executeQueryUrl(dataObj);
    });
});