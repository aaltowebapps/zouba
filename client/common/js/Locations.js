var Locations = Backbone.Collection.extend({
    model: Location, 
    localStorage: new Backbone.LocalStorage("LocationsList")
});