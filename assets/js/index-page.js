$(document).ready(function() {

	// Include the backstretch plugin to make the background images fully responsive and rotating
	$.backstretch(
		[
  	      "assets/img/chicago.jpg",
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
  	$("#search-date1").datepicker();
  	$("#search-date2").datepicker();
});