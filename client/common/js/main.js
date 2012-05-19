var Templates = {};
var routeslist;
var timetables;

/**
 * BACKBONE MODELS AND COLLECTIONS
 **/

/* Routes Model, Collection and Views*/
var Route = Backbone.Model.extend({
});

var RouteList = Backbone.Collection.extend({ 
	model: Route,
    localStorage: new Backbone.LocalStorage("RouteList")
});

/* Timetable Model, Collection and Views*/
var TimeTable = Backbone.Model.extend({
});

var TimeTableList = Backbone.Collection.extend({ 
	model: TimeTable
});

$(function() {
	// Link the save button to the function
	$("#saveRouteButton").click(function() {
		SaveRouteButtonPressed();
	});
	
	// Load the handlebars templates
	$('script[type="text/x-handlebars-template"]').each(function () {
	    Templates[this.id] = Handlebars.compile($(this).html());
	});

	// View for rendering the single saved route in the list
	var RouteView = Backbone.View.extend ({
		tagName: "li",
		events: {
			"click" : "loadDetails"
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
			// load the data from reittiopas
			fetchTimetable("","",this.model,true);
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
			el.listview("refresh");
			return this;
		},
	});
	
	var TimeTableView = Backbone.View.extend ({
		tagName: "li",
		events: {
		},
		initialize: function() {
			this.template = Templates.timetableelement;
			this.model.bind('all', this.render, this);
		},
		render: function() {
			$(this.el).html( this.template(this.model.toJSON()) );
			return this;
		}
	});
	
	var TimeTableListView = Backbone.View.extend ({
		el: $("#timetablelist"),
		events: {
		},
		initialize: function() {
			this.collection.bind('all', this.render, this);
		},
		render: function() {
			var el = this.$el;
			el.empty();
			this.collection.each(function(item) {
				var rv = new TimeTableView({model: item});
				el.append(rv.render().el);
			});
			el.listview("refresh");
			return this;
		}
	});
	
	//var exroute = new Route({name: "Kamppi to Otaniemi", start: "2551881,6673379", end: "2546489,6675524"});
	routeslist = new RouteList;
	var routesListView = new RoutesListView({collection: routeslist});
	//routeslist.add(exroute);
	
	timetables = new TimeTableList;
	var timetableslistView = new TimeTableListView({collection: timetables});
	
	routeslist.fetch();
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
    	tempRoute = new Route({name: $("#search_start").val()+" to "+$("#search_dest").val(), start: from, end: json[0].coords});
    	fetchTimetable(time, date, tempRoute, false);
    });
}

function fetchTimetable(time, date, route, saved) {
	// Fetch the data
	var baseUrl = "http://api.reittiopas.fi/hsl/prod/?";
    var parameters = [
        "request=route",
        "user=zouba",
        "pass=caf9r3ee",
        "format=json",
        "from="+route.get("start"),
        "to="+route.get("end")
    ];
    if(date != "")
    	parameters.push("date="+date);
    if(time != "") 
    	parameters.push("time="+time);
    var url = baseUrl+parameters.join("&");
    $.getJSON(url, function(json) {
    	if(saved)
    		$("#saveRouteButton").hide();
    	else
    		$("#saveRouteButton").show();
    	$("#routeName").html(route.get("name"));
	    // put it in the array that contains the timetables
		// and load the details page
		$.mobile.changePage('#timetable');
		timetables.reset();
    	for(i=0; i<json.length; ++i) {
    		// For every possible route
    		var te = new TimeTable;
    		for(j=0; j<json[i].length; ++j){
    			// The route element's general data is here
    			var el = json[i][j];
    			te.set("duration",el.duration/60+" min");
    			te.set("departure",el.legs[0].locs[0].depTime);
    			te.set("arrival",el.legs[el.legs.length-1].locs[el.legs[el.legs.length-1].locs.length-1].arrTime);
    			var buses = "";
    			var details = "";
    			for(k=0; k<el.legs.length; ++k){
    				// For every segment in the route
    				if(el.legs[k].type != "walk"){
    					buses += el.legs[k].code+"/";
    				}
    				// add to the details the start and end of the segment
    				details +="";
    			}
    			te.set("buses", buses);
    			te.set("details", details);
    		}
    		timetables.add(te);
    	}
    });
}

var tempRoute;
function SaveRouteButtonPressed() {
	routeslist.add(tempRoute);
	tempRoute.save();
	alert("Route Saved!");
	$("#saveRouteButton").hide();
}
