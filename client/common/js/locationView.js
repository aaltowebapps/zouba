var LocationView = Backbone.View.extend({
    tagName: "li",

    template: _.templaye($('#item-template')).html(),

    initialize: function() {
        this.model.bind('change', this.render, this);
    },

    render: function() {
        this.$el.html( this.template(this.model.toJSON()) );
        return this;
    }
});
