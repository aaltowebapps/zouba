var Route = Backbone.Model.extend({
	defaults: {
	    start: '',
	    end: ''
	}
});

var Routes = Backbone.Model.extend({ 
	model: Route,
    localStorage: new Backbone.LocalStorage("RoutesList")
});