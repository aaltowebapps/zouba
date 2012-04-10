(function($){

    $(document).ready(function () {
        LocationView = Backbone.View.extend({
            tagName: 'li',

            initialize: function(){
                _.bindAll(this, 'render');
            },

            render: function(){
                $(this.el).html('<span>'+this.model.get('name')+':'+this.model.get('address')+'</span>');
                return this;
            }
        });
    });

})(jQuery);
