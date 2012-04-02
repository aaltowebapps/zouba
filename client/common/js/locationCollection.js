var LocationList = Backbone.Collection.extend({
    model: Location,
    localStorage: new Store("locations-backbone")
});

var Locations = new LocationList;
