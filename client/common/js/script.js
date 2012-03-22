var locationFactory = function() {
	function newLocation(name, address, latitude, longitude) {
		var location = {
			"name" : name,
			"address" : address,
			"latitude" : latitude,
			"longitude" : longitude
		};
		return location;
	};
	
	return {
		newLocation : newLocation
	}
}

var reittiopasHandler = function () {
	var baseUrl = "http://api.reittiopas.fi/hsl/prod/?";
	var username = "user=zouba";
	var password = "pass=caf9r3ee";
	var coordSystem = "wgs84";
	var coordSystemIn = "epsg_in="+coordSystem;
	var coordSystemOut = "epsg_out="+coordSystem;
	var format = "format=json";
	
	function getLocation(name) {
		//TODO:	- GET to Reittiopas API with name as parameter
		//		- more results are returned in any case, check for unique names
		//		- if more results have same name, let the user choose which one he means
		//		- return location object
		var addr = "http://api.reittiopas.fi/hsl/prod/?request=geocode&user="+username+"&pass="+password+"&format="+format+"&epsg_out="+coordSystem+"&key="+name;
		// Show a loading message?
		$.get(addr, function(data) {
			// Hide the loading message?
			// handle the results in data
		});
	}
	
	return {
		getLocation : getLocation
	}
}

var localStorageFactory = function () {
	
	function putLoc(loc) {
		localStorage[loc.name] = JSON.serialize(loc);	  
	}
	
	function getLoc(name) {
		if(localStorage[name] == null) 
			localStorage[name] = reittiopasHandler.getLocation(name);
		return jQuery.parseJSON(localStorage[name]);
	}
	
	return {
		putLocation : putLoc,
		getLocation : getLoc
	}
}
