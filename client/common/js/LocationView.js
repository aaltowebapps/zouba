(function($){

    $(document).ready(function () {
        LocationView = Backbone.View.extend({
            tagName: 'li',

            initialize: function(){
                _.bindAll(this, 'render');
            },

            render: function(){
                var bits = [];
                bits.push( this.model.get('name') );
                bits.push( this.model.get('address') );
                bits.push( this.model.get('coords') );
                $(this.el).html('<span>'+bits.join(':')+'</span>');
                return this;
            }
        });
    });

})(jQuery);
