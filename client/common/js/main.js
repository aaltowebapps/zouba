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
	
	// Link the checkbox in the search page
	$("#use_gps-cb").click(function() {
  		if($("#use_gps-cb")[0].checked)
			$("#search_start").attr("disabled","disabled");
		else
			$("#search_start").removeAttr("disabled");
	});
	
	// Load the handlebars templates
	$('script[type="text/x-handlebars-template"]').each(function () {
	    Templates[this.id] = Handlebars.compile($(this).html());
	});

	// View for rendering the single saved route in the list
	var RouteView = Backbone.View.extend ({
		tagName: "li",
		events: {
			"click .fetch" : "loadDetails",
			"click .remove" : "deleteRoute"
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
			$.mobile.showPageLoadingMsg("a", "Loading", false);
			if(this.model.get("origin")=="gps"){
				fetchGPSLocationTimetable("","",this.model, true);
			} else
				fetchTimetable("","",this.model,true);
		},
		deleteRoute: function() {
			this.model.destroy();
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
		tagName: "div",
		events: {
		},
		initialize: function() {
			this.template = Templates.timetableelement;
			this.model.bind('all', this.render, this);
		},
		render: function() {
			$(this.el).html( this.template(this.model.toJSON()) );
			$(this.el).attr("data-role","collapsible");
			$(this.el).attr("data-collapsed","true");
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
			el.collapsibleset("refresh");
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
	
	$.mobile.showPageLoadingMsg("a", "Loading", false);
	if($("#use_gps-cb")[0].checked)
		getGPSCoordinates(time, date);
	else
		getFromCoordinates(time, date);
}

function getGPSCoordinates(time, date) {
	tempRoute = new Route({start: "", name: "", origin: "gps"});
	getToCoordinates(time, date, tempRoute);
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
    	tempRoute = new Route({start: json[0].coords, name: $("#search_start").val()+" "});
    	getToCoordinates(time, date, tempRoute);
    });
}

function getToCoordinates(time, date, route) {
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
    	route.set("end", json[0].coords);
    	var tmp = route.get("name");
    	route.set("name", tmp+"to "+$("#search_dest").val());
    	if(route.get("origin")=="gps")
    		fetchGPSLocationTimetable(time, date, route, false);
    	else
    		fetchTimetable(time, date, route, false);
    });
}

function getDurationString(str) {
	res = "";
	str = parseInt(str);
	if (str > 3600) {
		res = parseInt(str/3600)+" h ";
	}
	
	res = res + parseInt((str%3600)/60) + " min";
	return res;
}

function fetchGPSLocationTimetable(time, date, route, saved) {
	navigator.geolocation.getCurrentPosition(function(position) {
		var lat = position.coords.latitude;
  		var lng = position.coords.longitude;
  		var baseUrl = "http://api.reittiopas.fi/hsl/prod/?";
	
	    var parameters = [
	        "request=reverse_geocode",
	        "user=zouba",
	        "pass=caf9r3ee",
	        "format=json",
	        "epsg_in=wgs84",
	       	"coordinate="+lng+","+lat
	    ];
	    
	    var url = baseUrl+parameters.join("&");
    	$.getJSON(url, function(json) {
    		route.set("start",json[0].coords);
    		fetchTimetable(time, date, route, saved);
    	});
	});
}

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

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
    	//$("#routeName").html(route.get("name"));
	    // put it in the array that contains the timetables
		// and load the details page
		$.mobile.changePage('#timetable');
		timetables.reset();
    	for(i=0; i<json.length; ++i) {
    		// For every possible route
    		var te = new TimeTable();
    		for(j=0; j<json[i].length; ++j){
    			// The route element's general data is here
    			var el = json[i][j];
    			te.set("duration",getDurationString(el.duration));
    			te.set("departure",el.legs[0].locs[0].depTime.substring(8).insert(2, ':'));
    			te.set("arrival",el.legs[el.legs.length-1].locs[el.legs[el.legs.length-1].locs.length-1].arrTime.substring(8).insert(2, ':'));
    			var buses = "";
    			var details = "";
    			for(k=0; k<el.legs.length; ++k){
    				// For every segment in the route
    				var temp = el.legs[k].locs[0].depTime.substring(8);
					details += temp.substr(0,2)+":"+temp.substr(2,2) +" -> ";
					temp = el.legs[k].locs[el.legs[k].locs.length-1].arrTime.substring(8);
					details += temp.substr(0,2)+":"+temp.substr(2,2) + " ";
					
					var trans_nr = "";
    				
    				if(el.legs[k].type != "walk"){
    					trans_nr = el.legs[k].code.split(" ")[0].substring(1).replace(/^0+/, '');
    					switch (el.legs[k].type) {
    						case '2':
    							details += 'tram ';
    							trans_nr = trans_nr.substr(-2, 2);
    							break;
    						case '6':
    							details += 'metro ';
    							trans_nr = '';
    							break;
    						case '7':
    							details += 'ferry ';
    							break;
    						case '12':
    							details += 'train ';
    							trans_nr = trans_nr.substr(-1, 1);
    							break;
    						default:
    							details += 'bus ';
    							
    					}
    					buses += trans_nr +"/";
    					details += trans_nr;
    				}
    				else {
						details += el.legs[k].type;
					}
					//Check if destination name is not null and append
					dest = el.legs[k].locs[el.legs[k].locs.length-1].name;
					if (!dest)
						dest = 'final destination'
					details += " to "+ dest + '\n';
    				// add to the details the start and end of the segment
    			}
    			//Truncate the last from buses
    			buses = buses.replace(/\/*$/, '');
    			te.set("buses", buses);
    			te.set("details", details);
    		}
    		timetables.add(te);
    	}
    	$.mobile.hidePageLoadingMsg();
    });
}

var tempRoute;
function SaveRouteButtonPressed() {
	routeslist.add(tempRoute);
	tempRoute.save();
	alert("Route Saved!");
	$("#saveRouteButton").hide();
}
