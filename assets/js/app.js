var config = {
    apiKey: "AIzaSyDaPvYALiV1qQwyDxIrIfkwCUerTu_uSiA",
    authDomain: "firstproject-b5d04.firebaseapp.com",
    databaseURL: "https://firstproject-b5d04.firebaseio.com",
    storageBucket: "firstproject-b5d04.appspot.com",
 };
  	firebase.initializeApp(config);

var database = firebase.database();
const auth = firebase.auth();

$(document).ready(function() {
var url = "https://www.eventbriteapi.com/v3/events/search/?token=IVKXSGGHO6MZSHMF5QZZ&location.address=austin&location.within=10mi";

$.ajax({
	url: url,
	method: "GET",
	}).done(function(response) {
	console.log(response);
	console.log(response.events[1].description.text);
	//$("#test").html(response.events[3].description.text)
	console.log(response.events[1].end.local)
	//$("#test").append(response.events[3].end.local)
	console.log(response.events[1].name.text)
	//$("#test").prepend(response.events[3].name.text)
	console.log(response.events[1].start.local)
	//$("#test").append(response.events[3].start.local)

	response.events.forEach (function(item, index, arr) {
		//let stuff = '<div id=' + index + '>';
		var sliced;
		if (item.description.text != null) {
			sliced = item.description.text.slice(0, 100);
		} else {
			sliced = "No description";
		}
		
		//$(".divs").append(stuff);	
		//$("#" + index).addClass("yo");	
		//$("#" + index).html(item.name.text);
		$("#" + index).append(sliced);
		let html = '<div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">' +
                  '<div class="panel event-content text-center">' +
                    	'<h3>' + item.name.text + '</h3>' +
                    	'<p>' + sliced + '</p>' +
                    	'<button type="button" class="btn btn-primary btn-lg btn-block">Add Favorite</button>' +
                  '</div>' +
        		  '</div>';
        $(".main").append(html);
	});
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

