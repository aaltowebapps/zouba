var Templates = {};
var routeslist;

/**
 * BACKBONE MODELS AND COLLECTIONS
 **/

/* Routes Model and Collection */
var Route = Backbone.Model.extend({
});

var RouteList = Backbone.Collection.extend({ 
	model: Route,
    localStorage: new Backbone.LocalStorage("RoutesList")
});

$(function() {
	// Link the search button to the function
	$("#search_button").click(function() {
		SearchButtonPressed();
	});
	
	// Load the handlebars templates
	$('script[type="text/x-handlebars-template"]').each(function () {
	    Templates[this.id] = Handlebars.compile($(this).html());
	});

	// View for rendering the single saved route in the list
	var RouteView = Backbone.View.extend ({
		tagName: "li",
		events: {
			"click #fetch" : "loadDetails"
		},
		initialize: function() {
			this.template = Templates.route;
			this.model.bind('all', this.render, this);
		},
		render: function() {
			$(this.el).html( this.template(this.model.toJSON()) );
			return this;
		},
		loadDetails: function() {
			// When the element is clicked from the list
			// get the coordinates
			var from = this.model.get("start");
			var to = this.model.get("end");
			// load the data from reittiopas
			var baseUrl = "http://api.reittiopas.fi/hsl/prod/?";
		    var parameters = [
		        "request=route",
		        "user=zouba",
		        "pass=caf9r3ee",
		        "format=json",
		        "from="+from,
		        "to="+to
		    ];
		    var url = baseUrl+parameters.join("&");
		    $.getJSON(url, function(data) {
			    alert(data);
			    // put it in the array that contains the route details
				// and load the details page	
	        });
		}
	});
	
	//View for rendering the list of saved routes
	var RoutesListView = Backbone.View.extend ({
		el: $("#routesList"),
		events: {
		},
		initialize: function() {
			this.collection.bind('all', this.render, this);
		},
		render: function() {
			var el = this.$el;
			//alert("rendering the collection");
			el.empty();
			this.collection.each(function(item) {
				var rv = new RouteView({model: item});
				el.append(rv.render().el);
			});
			return this;
		},
	});
	var exroute = new Route({name: "Kamppi to Otaniemi", start: "2551881,6673379", end: "2546489,6675524"});
	routeslist = new RouteList;
	var routesListView = new RoutesListView({collection: routeslist});
	routeslist.add(exroute);
});

function SearchButtonPressed() {
	var time = $("#search_time").val().replace(":","").replace(" PM","").replace(" AM", "");
	if($("#search_date").val() != "")
		var d = new Date($("#search_date").val());
	else 
		var d = new Date();
	var month = ""+(d.getMonth()+1);
	if(month.length == 1) month = "0"+month;
	var day = ""+d.getDate();
	if(day.length == 1) day = "0"+day;
	var year = d.getFullYear();
	var date = ""+year+month+day;
	
	if($("#search_start").val() != "" && $("#search_dest").val() != "") {
		getFromCoordinates(time, date);
	}
}

function getFromCoordinates(time, date) {
	var baseUrl = "http://api.reittiopas.fi/hsl/prod/?";
    var parameters = [
        "request=geocode",
        "user=zouba",
        "pass=caf9r3ee",
        "format=json",
        "key="+$("#search_start").val()
    ];
    var url = baseUrl+parameters.join("&");
    $.getJSON(url, function(json) {
    	getToCoordinates(time, date, json[0].coords);
    });
}


function getToCoordinates(time, date, from) {
	var baseUrl = "http://api.reittiopas.fi/hsl/prod/?";
    var parameters = [
        "request=geocode",
        "user=zouba",
        "pass=caf9r3ee",
        "format=json",
        "key="+$("#search_dest").val()
    ];
    var url = baseUrl+parameters.join("&");
    $.getJSON(url, function(json) {
    	fetchTimetable(time, date, from, json[0].coords);
        //self.set("coords", json[0].coords);
    });
}

function fetchTimetable(time, date, from, to) {
	var baseUrl = "http://api.reittiopas.fi/hsl/prod/?";
    var parameters = [
        "request=route",
        "user=zouba",
        "pass=caf9r3ee",
        "format=json",
        "from="+from,
        "to="+to
    ];
    if(date != "")
    	parameters.push("date="+date);
    if(time != "") 
    	parameters.push("time="+time);
    var url = baseUrl+parameters.join("&");
    $.getJSON(url, function(data) {
	    alert(data);
	    // put it in the array that contains the route details
		// and load the details page	
    });
}
