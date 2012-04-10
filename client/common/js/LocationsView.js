(function($){

    $(document).ready(function () {
        LocationsView = Backbone.View.extend({
            el: $('div[data-role="page"]'),

            events: {
                'click button#edit': 'addLocation'
            },

            initialize: function(){
                _.bindAll(this, 'render', 'addLocation', 'appendLocation');

                this.collection = new Locations();
                this.collection.bind('add', this.appendLocation);

                this.counter = 0;
                this.render();
            },

            render: function(){
                var self = this;

                _(this.collection.models).each(function(location){
                    self.appendLocation(location);
                }, this);
            },

            addLocation: function(){
                this.counter++;
                var location = new Location();
                location.set({
                    name: location.get('name') + this.counter
                });
                this.collection.add(location);
            },

            appendLocation: function(location){
                var locationView = new LocationView({
                    model: location
                });
                $('ul', this.el).append(locationView.render().el);
                $('ul').listview("refresh");
            }
        });
    });

})(jQuery);
