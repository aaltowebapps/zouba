var AppView = Backbone.View.extend({
    el: $("#zoubaapp"),
    statsTemplate: _.template($('#stats-template').html()),

    initialize: function() {
        Locations.bind('add', this.addOne, this);

        Locations.fetch();
    },

    render: function() {

      if (Locations.length) {
        this.el.html("here!");
      }
    },

    addOne: function(location) {
      var view = new LocationView({model: Location});
      this.$("#location-list").append(view.render().el);
    },
});
