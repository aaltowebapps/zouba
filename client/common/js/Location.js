var Location = Backbone.Model.extend({
	defaults: {
	    name: '',
	    address: '',
	    coords: ''
	},
	
	initialize: function() {
	    _.bindAll(this, 'geocodeAddress');
	
	    if ( this.get("address") != "" ) {
	        this.geocodeAddress();
	    }
	
	    this.bind("change:address", function() {
	        this.geocodeAddress();
	    } );
	},
	
	geocodeAddress: function() {
	    var self = this;
	    //var baseUrl = "http://localhost/zouba/client/common/apiProxy/hsl/prod/?";
	    var baseUrl = "http://api.reittiopas.fi/hsl/prod/?";
	    var coordSystem = "wgs84";
	    var encodedURI = encodeURI( this.get("address") );
	    var parameters = [
	        "request=geocode",
	        "user=zouba",
	        "pass=caf9r3ee",
	        "wgs84",
	        "epsg_in="+coordSystem,
	        "epsg_out="+coordSystem,
	        "format=json",
	        "key="+encodedURI
	    ];
	
	    var url = baseUrl+parameters.join("&");
	
	    //$.getJSON("../js/response.json", function(json) {
	    $.getJSON(url, function(json) {
	        self.set("coords", json[0].coords);
        });
    },
});
