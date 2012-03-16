var LATIT = 0;
var LONG = 0;


function getLocation(categoryName){
	
	sucess_geo = function success(position) {
		
		latit = position.coords.latitude;
		longit = position.coords.longitude;
		//var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		//console.log(latlng.Ua);
		// var myOptions = {
			// zoom : 15,
			// center : latlng,
			// mapTypeControl : false,
			// navigationControlOptions : {
				// style : google.maps.NavigationControlStyle.SMALL
			// },
			// mapTypeId : google.maps.MapTypeId.ROADMAP
		// };
		// var mapcanvas = $('#mapcanvas');
		// var map = new google.maps.Map(mapcanvas[0], myOptions);
		// var marker = new google.maps.Marker({
			// position : latlng,
			// map : map,
			// title : "I am here!"
		// });
		
		createPlacesList(latit, longit, '1000', categoryName);
		
	};
	error_geo = function error(msg) {
		var errMsg = typeof msg == 'string' ? msg : "Geolocation failed";
		alert(errMsg);
	};
		
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(sucess_geo, error_geo);
	} else {
		error('Geolocation not supported');
	}
};

$("section").live("pageinit", function() {
	var latit = 0;
	var longit = 0;			
	getLocation('');
	
});

function createPlacesList(lat, lng, rad, tp) {
	$.mobile.showPageLoadingMsg("b", "aquii", true);
	console.log('Results!');
	$.ajax({
		//url : './test.json',
		url : './search.php',
		data : {
			location : lat + ',' + lng,
			radius : rad,
			sensor : false,
			types : tp,
			key : 'AIzaSyAx7gD4hwEClrs6ezcAuytd9ipvJlvDUAs'

		},
		dataType : 'json',
		type : 'GET',
		// on success
		success : function(data) {
			console.log(data.results);
			items = data.results;

			$('#list').html('');
			$.each(items, function(i, item) {
				var div_data2 = "<li><a target='' href='place.html' ><img src='" + item.icon + "' alt='' /><h3>" + item.name + "</h3><p>" + item.vicinity + "</p></a></li>";
				$('#list').append(div_data2);
			});
			$('#list').listview("refresh");
			$('.loading').fadeOut(750, function() {
				$('#list').hide().fadeIn(750);
			});
			$.mobile.hidePageLoadingMsg();
		},
		// on failure
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});

}

// Listen for any attempts to call changePage().
$(document).bind("pagebeforechange", function(e, data) {
	// We only want to handle changePage() calls where the caller is
	// asking us to load a page by URL.
	if( typeof data.toPage === "string") {
		// We are being asked to load a page by URL, but we only
		// want to handle URLs that request the data for a specific
		// category.
		var u = $.mobile.path.parseUrl(data.toPage), re = /^#nearby_places/;
		if(u.hash.search(re) !== -1) {
			// We're being asked to display the items for a specific category.
			// Call our internal method that builds the content for the category
			// on the fly based on our in-memory category data structure.
			showCategory(u, data.options);
			// Make sure to tell changePage() we've handled this call so it doesn't
			// have to do anything.
			e.preventDefault();
		}
	}
});
function showCategory(urlObj, options) {
	var categoryName = urlObj.hash.replace(/.*category=/, "");
	pageSelector = urlObj.hash.replace(/\?.*$/, "");	
	getLocation(categoryName);
}