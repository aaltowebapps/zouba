var Templates = {};
var routeslist;

/**
 * BACKBONE MODELS AND COLLECTIONS
 **/

/* Routes Model */
var Route = Backbone.Model.extend({
});

var RouteList = Backbone.Collection.extend({ 
	model: Route,
    localStorage: new Backbone.LocalStorage("RoutesList")
});

$(function() {
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
