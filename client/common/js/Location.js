(function($){

    $(document).ready(function () {
        Location = Backbone.Model.extend({
            defaults: {
                name: 'work',
                address: 'Westendinkatu 7, Espoo'
            }
        });
    });

})(jQuery);

