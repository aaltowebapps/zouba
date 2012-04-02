var LocationView = Backbone.View.extend({
    tagName: "li",

    template: _.template($('#item-template')).html(),

    initialize: function() {
        this.model.bind('change:coords', this.render, this);
    },

    render: function() {
        this.$el.html( this.template(this.model.toJSON()) );
        return this;
    }
});
