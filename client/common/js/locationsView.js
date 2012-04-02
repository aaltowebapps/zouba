var LocationsView = Backbone.View.extend ({
    el: $("#locationsList"),
    events: {
    },
    initialize: function() {
        this.collection.bind('reset', this.render, this);
        this.collection.bind('all', this.render, this);
    },
    render: function() {
        var el = this.$el;
        el.empty();
        this.collection.each(function(location) {
            var locationView = new LocationView({ model: location });
            el.append(locationView.render().el);
        });
        this.$el.listview('refresh');
        return this;
    },
});
