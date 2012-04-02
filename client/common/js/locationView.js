var Templates = {};

$(document).ready(function() {
    $('script[type="text/x-handlebars-template"]').each(function () {
        Templates[this.id] = Handlebars.compile($(this).html());
    });
});

var LocationView = Backbone.View.extend({
    tagName: "li",

    initialize: function() {
        this.model.bind('change:coords', this.render, this);
        this.template = Templates.location;
    },

    render: function() {
        this.$el.html( this.template(this.model.toJSON()) );
        return this;
    }
});
