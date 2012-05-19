var reittiopasHandler = function () {
    // Reittiopas URL parameters
    var baseUrl = "http://api.reittiopas.fi/hsl/prod/?";
    var username = "user=zouba";
    var password = "pass=caf9r3ee";
    var coordSystem = "wgs84";
    var coordSystemIn = "epsg_in="+coordSystem;
    var coordSystemOut = "epsg_out="+coordSystem;
    var format = "format=json";
    
    function getLocation(address) {
        //TODO:    - GET to Reittiopas API with name as parameter
        //        - more results are returned in any case, check for unique names
        //        - if more results have same name, let the user choose which one he means
        //        - return location object
        var url = "http://api.reittiopas.fi/hsl/prod/?request=geocode&"+username+"&"+password+"&"+format+"&"+coordSystemOut+"&key="+address;
        // Show a loading message?
        // Check for connection? what to do if there's no connection? (offline mode)
        $.get(url, function(data) {
            // Hide the loading message?
            /*var possibilities = [];
            for(i=0; i<data.length; ++i) {
                if(data[i].name == name) {
                    
                }
            }*/
        });
    }
    
    return {
        getLocation : getLocation
    }
}

// we can use this to create new locations
var locationFactory = function() {
    function newLocation(address) {
        // TODO: send the request to Reittiopas
        /*
        var location = {
            "name" : name,
            "address" : address,
            "latitude" : latitude,
            "longitude" : longitude
        };
        successCallback
        */
    };
    
    function newLocationSuccessCallback() {
        
    }
    
    function checkValidity(loc) {
        // TODO: implement the check
        return true;
    }
    
    return {
        newLocation : newLocation,
        isValid : checkValidity
    }
}

var localStorageFactory = function () {
    
    // Insert a location in the local storage
    function putLoc(loc) {
        localStorage[loc.address] = JSON.serialize(loc);      
    }
    
    // Get a location from the local storage
    function getLoc(address) {
        if(localStorage[address] == null) {
            // if we can't find the location we fetch it online
            // Just occurred to me that this may not work.. :P i'll open a new issue
            /*
            var loc = reittiopasHandler.getLocation(name);
            if(loc)
                putLoc(loc);
            else
                return null;
            */ 
            return null;
        }
        return jQuery.parseJSON(localStorage[address]);
    }
    
    return {
        putLocation : putLoc,
        getLocation : getLoc
    }
}
