var LocationsModel = Backbone.Collection.extend({
    model: Location,
    localStorage: new Store("locations-backbone")
});
